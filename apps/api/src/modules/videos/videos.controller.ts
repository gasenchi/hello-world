import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MinioService } from '../minio/minio.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('videos')
export class VideosController {
  constructor(private minio: MinioService, private prisma: PrismaService) {}

  @Post('presign')
  async presign(@Body() body: { contentType: string; creatorId: string; caption?: string; soundId?: string }) {
    const { contentType, creatorId, caption, soundId } = body;
    const result = await this.minio.presignRawUpload(contentType || 'video/mp4');
    const video = await this.prisma.video.create({
      data: {
        creatorId,
        caption: caption || '',
        soundId: soundId || null,
        status: 'UPLOADING',
        uploadKey: result.key,
      },
    });
    return { ...result, videoId: video.id };
  }

  @Get(':id/status')
  async status(@Param('id') id: string) {
    const v = await this.prisma.video.findUnique({ where: { id }, include: { assets: true } });
    if (!v) return { status: 'NOT_FOUND' };
    return { id: v.id, status: v.status, eligibleForFeed: v.eligibleForFeed, assets: v.assets.map(a => ({ kind: a.kind, key: a.objectKey })) };
  }
}
