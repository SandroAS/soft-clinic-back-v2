import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;
  private readonly externalMinioClient: Minio.Client;
  private readonly logger = new Logger(MinioService.name);

  private readonly port: number = parseInt(this.configService.get('MINIO_PORT'), 10)!;
  private readonly useSSL: boolean = JSON.parse(this.configService.get('MINIO_USE_SSL'))!;
  private readonly accessKey: string = this.configService.get('MINIO_ROOT_USER')!;
  private readonly secretKey: string = this.configService.get('MINIO_ROOT_PASSWORD')!;
  private readonly region: string = this.configService.get('MINIO_REGION')!;
  private readonly bucketName: string = this.configService.get('MINIO_BUCKET')!;

  constructor(private readonly configService: ConfigService) {
    const minioClientConfig = {
      port: this.port,
      useSSL: this.useSSL,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      region: this.region
    }

    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT')!,
      ...minioClientConfig
    });

    this.externalMinioClient = new Minio.Client({
      endPoint: this.configService.get('APP_HOST')!,
      ...minioClientConfig
    });
  }

  async uploadFile(file: Express.Multer.File, bucket: string, fileName: string) {
    try {
      await this.createBucket(this.bucketName, this.region)

      await this.minioClient.putObject(bucket, fileName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
        'x-amz-acl': 'public-read',
      });

      const url = await this.getFileUrl(fileName, bucket);
      return { fileName, url };
    } catch (err) {
      this.logger.error(`Erro ao tentar fazer upload do arquivo '${fileName}'. Erro: '${err}'`);
      throw new InternalServerErrorException('Erro ao fazer upload do arquivo');
    }
  }

  async createBucket(bucketName: string, region: string): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(bucketName);

      if (bucketExists) {
        return;
      }

      await this.minioClient.makeBucket(bucketName, region);
      this.logger.log(`Bucket ${bucketName} criado com sucesso na região ${region}.`);
    } catch (err) {
      this.logger.error(`Erro ao tentar criar Bucket '${bucketName}'. Erro: '${err}'`);
      throw new Error('Erro ao criar o bucket');
    }
  }

  async getFileUrl(fileName: string, bucket: string = this.bucketName) {
    try {
      return await this.externalMinioClient.presignedGetObject(bucket, fileName);
    } catch (err) {
      this.logger.error(`Erro ao tentar gerar url assinada '${fileName}' do MinIO: ${err.message}`);
      throw new InternalServerErrorException('Erro ao gerar URL assinada');
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
