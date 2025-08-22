import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SocialController } from './social.controller';

@Module({
  controllers: [SocialController],
  providers: [PrismaService],
})
export class SocialModule {}
