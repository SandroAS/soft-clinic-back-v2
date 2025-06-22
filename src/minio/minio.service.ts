import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as path from 'path';
import * as crypto from 'crypto';
import { User } from '@/entities/user.entity';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly minioClient: Minio.Client;
  private readonly externalMinioClient: Minio.Client;
  private readonly logger = new Logger(MinioService.name);

  private readonly minioPort: number;
  private readonly minioUseSSL: boolean;
  private readonly minioAccessKey: string;
  private readonly minioSecretKey: string;
  private readonly minioRegion: string;
  private readonly minioBucketName: string;
  private readonly minioInternalEndpoint: string;
  private readonly minioExternalEndpoint: string;


  constructor(private readonly configService: ConfigService) {
    this.minioPort = parseInt(this.configService.get<string>('MINIO_PORT', '9000'), 10);
    this.minioUseSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
    this.minioAccessKey = this.configService.get<string>('MINIO_ROOT_USER')!;
    this.minioSecretKey = this.configService.get<string>('MINIO_ROOT_PASSWORD')!;
    this.minioRegion = this.configService.get<string>('MINIO_REGION', 'us-east-1')!;
    this.minioBucketName = this.configService.get<string>('MINIO_BUCKET')!;
    this.minioInternalEndpoint = this.configService.get<string>('MINIO_ENDPOINT')!;
    this.minioExternalEndpoint = this.configService.get<string>('APP_HOST')!;

    if (!this.minioAccessKey || !this.minioSecretKey || !this.minioBucketName ||
        !this.minioInternalEndpoint || !this.minioExternalEndpoint) {
      this.logger.error('Missing one or more MinIO environment variables. Please check your .env file.');
      throw new Error('MinIO configuration incomplete.');
    }

    const minioClientConfig = {
      port: this.minioPort,
      useSSL: this.minioUseSSL,
      accessKey: this.minioAccessKey,
      secretKey: this.minioSecretKey,
      region: this.minioRegion
    };

    this.minioClient = new Minio.Client({
      endPoint: this.minioInternalEndpoint,
      ...minioClientConfig
    });

    this.externalMinioClient = new Minio.Client({
      endPoint: this.minioExternalEndpoint,
      ...minioClientConfig
    });
  }

  async onModuleInit() {
    await this.createBucketIfNotExists();
  }

  private async createBucketIfNotExists(): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.minioBucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.minioBucketName, this.minioRegion);
        this.logger.log(`Bucket '${this.minioBucketName}' created successfully in region '${this.minioRegion}'.`);
      } else {
        this.logger.log(`Bucket '${this.minioBucketName}' already exists.`);
      }
    } catch (err) {
      this.logger.error(`Error trying to create/check bucket '${this.minioBucketName}'. Error: '${err}'`);
      throw new InternalServerErrorException('Error creating/checking MinIO bucket.'); // Melhorar a exceção
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    const objectName = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

    try {
      await this.minioClient.putObject(this.minioBucketName, objectName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      });
      this.logger.log(`File '${objectName}' uploaded successfully to bucket '${this.minioBucketName}'.`);
      return objectName;
    } catch (err) {
      this.logger.error(`Error uploading file '${file.originalname}' to MinIO. Error: '${err}'`);
      throw new InternalServerErrorException('Error uploading file.');
    }
  }

  async getPresignedUrl(objectName: string, expirySeconds: number = 7 * 24 * 60 * 60): Promise<string> {
    if (!objectName) {
      return null;
    }
    try {
      const url = await this.externalMinioClient.presignedGetObject(
        this.minioBucketName,
        objectName,
        expirySeconds
      );
      return url;
    } catch (err) {
      this.logger.error(`Error generating presigned URL for '${objectName}': ${err.message}`);
      throw new InternalServerErrorException('Error generating presigned URL.');
    }
  }

  async processUsersWithPresignedUrls(users: User[]): Promise<User[]> {
    const processedUsers = await Promise.all(
      users.map(async (user) => {
        if (user.profile_img_url && !user.profile_img_url.includes('googleusercontent')) {
          try {
            user.profile_img_url = await this.getPresignedUrl(user.profile_img_url);
          } catch (err) {
            this.logger.error(`Falha ao tentar gerar URL assinada para imagem '${user.profile_img_url}' (usuário UUID: ${user.uuid}): ${err.message}`);
            user.profile_img_url = null;
          }
        }
        return user;
      }),
    );
    return processedUsers;
  }

  /**
   * Remove um arquivo do MinIO.
   * @param objectName O nome do objeto a ser removido.
   */
  async removeFile(objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.minioBucketName, objectName);
      this.logger.log(`File '${objectName}' removed successfully from bucket '${this.minioBucketName}'.`);
    } catch (error) {
      this.logger.error(`Error removing file '${objectName}' from MinIO: ${error.message}`);
      throw new InternalServerErrorException('Error removing file.'); // Padronizar exceção
    }
  }
}
