import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Client } from 'minio';
import * as path from 'path';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;
  private readonly externalMinioClient: Client;
  private readonly logger = new Logger(MinioService.name);

  private readonly bucketName: string;
  private readonly minioEndpoint: string;
  private readonly minioPort: number;
  private readonly useSSL: boolean;

  constructor(private readonly configService: ConfigService) {
    this.minioEndpoint = this.configService.get<string>('MINIO_ENDPOINT')!;
    this.minioPort = this.configService.get<number>('MINIO_PORT')!;
    this.useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true'; 
    this.bucketName = this.configService.get<string>('MINIO_BUCKET')!;
    const accessKey = this.configService.get<string>('MINIO_ROOT_USER')!;
    const secretKey = this.configService.get<string>('MINIO_ROOT_PASSWORD')!;

    if (!this.minioEndpoint || !this.minioPort || this.useSSL === undefined || !this.bucketName || !accessKey || !secretKey) {
        this.logger.error('Variáveis de ambiente do MinIO incompletas. Verifique seu arquivo .env!');
        throw new Error('Configuração do MinIO ausente ou incompleta.');
    }

    const minioClientConfig = {
      port: this.minioPort,
      useSSL: this.useSSL,
      accessKey: accessKey,
      secretKey: secretKey,
    };

    this.minioClient = new Client({
      endPoint: this.minioEndpoint,
      ...minioClientConfig
    });

    this.externalMinioClient = new Client({
      endPoint: this.configService.get('APP_HOST')!,
      ...minioClientConfig
    });
  

    this.createBucketIfNotExists(this.bucketName);
  }

  async createBucketIfNotExists(bucket: string) {
    try {
      const exists = await this.minioClient.bucketExists(bucket);
      if (!exists) {
        await this.minioClient.makeBucket(bucket, 'us-east-1');
        this.logger.log(`Bucket '${bucket}' criado com sucesso.`);
      } else {
        this.logger.log(`Bucket '${bucket}' já existe.`);
      }
    } catch (error) {
      this.logger.error(`Erro ao criar/verificar bucket '${bucket}': ${error.message}`);
      throw error;
    }
  }

  getClient() {
    return this.minioClient;
  }

  /**
   * Faz o upload de um arquivo para o MinIO.
   * @param file O arquivo a ser upado (do tipo Express.Multer.File).
   * @param folder Opcional: pasta dentro do bucket (ex: 'profile-images').
   * @returns O nome único do objeto no bucket.
   */
  async uploadFile(file: Express.Multer.File, folder?: string): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`; // Gera nome único
    const objectName = folder ? `${folder}/${fileName}` : fileName; // Inclui a pasta no nome do objeto

    try {
      await this.minioClient.putObject(this.bucketName, objectName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      });
      this.logger.log(`Arquivo '${objectName}' enviado com sucesso para o bucket '${this.bucketName}'.`);
      return objectName;
    } catch (error) {
      this.logger.error(`Erro ao fazer upload do arquivo '${file.originalname}' para o MinIO: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retorna uma URL pré-assinada para um objeto no MinIO.
   * Esta URL tem um tempo de expiração e concede acesso temporário ao objeto.
   * @param objectName O nome do objeto no bucket (retornado por `uploadFile`).
   * @param expirySeconds O tempo em segundos que a URL será válida (padrão: 7 dias).
   * @returns A URL pré-assinada do objeto.
   */
  async getFileUrl(objectName: string, expirySeconds: number = 7 * 24 * 60 * 60): Promise<string> {
    if (!objectName) {
      return null;
    }

    try {
      const url = await this.externalMinioClient.presignedGetObject(this.bucketName, objectName, expirySeconds);
      this.logger.debug(`URL pré-assinada gerada para '${objectName}', válida por ${expirySeconds}s.`);
      return url;
    } catch (error) {
      this.logger.error(`Erro ao gerar URL pré-assinada para '${objectName}': ${error.message}`);
      throw new InternalServerErrorException('Erro ao gerar URL para o arquivo.');
    }
  }

  /**
   * Remove um arquivo do MinIO.
   * @param objectName O nome do objeto a ser removido.
   */
  async removeFile(objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, objectName);
      this.logger.log(`Arquivo '${objectName}' removido com sucesso do bucket '${this.bucketName}'.`);
    } catch (error) {
      this.logger.error(`Erro ao remover o arquivo '${objectName}' do MinIO: ${error.message}`);
      throw error;
    }
  }
}
