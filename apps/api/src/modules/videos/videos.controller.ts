import { Body, Controller, Post } from '@nestjs/common';
import { MinioService } from '../minio/minio.service';

@Controller('videos')
export class VideosController {
  constructor(private minio: MinioService) {}

  @Post('presign')
  async presign(@Body() body: { contentType: string }) {
    const { contentType } = body;
    const result = await this.minio.presignRawUpload(contentType || 'video/mp4');
    return result;
  }
}
