import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VideosController } from './videos.controller';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [VideosController],
  providers: [PrismaService],
})
export class VideosModule {}
