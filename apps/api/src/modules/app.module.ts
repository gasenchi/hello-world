import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { FeedModule } from './feed/feed.module';
import { VideosModule } from './videos/videos.module';
import { SocialModule } from './social/social.module';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MinioModule,
    FeedModule,
    VideosModule,
    SocialModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
