import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioService {
  private client: Client;
  private bucketName: string;

  constructor(private config: ConfigService) {
    this.client = new Client({
      endPoint: this.config.get<string>('MINIO_ENDPOINT', '127.0.0.1'),
      port: parseInt(this.config.get<string>('MINIO_PORT', '9000'), 10),
      useSSL: false,
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY', 'minio'),
      secretKey: this.config.get<string>('MINIO_SECRET_KEY', 'minio12345'),
    });
    this.bucketName = this.config.get<string>('MINIO_BUCKET', 'videos');
  }

  async presignRawUpload(contentType: string): Promise<{ url: string; key: string }> {
    const key = `raw-uploads/${uuidv4()}`;
    const policy = await this.client.presignedPutObject(this.bucketName, key, 60 * 10, {
      'Content-Type': contentType,
    });
    return { url: policy, key };
  }

  async presignGet(key: string, expirySec = 3600): Promise<string> {
    return this.client.presignedGetObject(this.bucketName, key, expirySec);
  }

  getPublicUrl(key: string): string {
    const host = this.config.get<string>('MINIO_PUBLIC_HOST', 'http://localhost:9000');
    return `${host}/${this.bucketName}/${key}`;
  }
}
