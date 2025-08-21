import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller()
export class SocialController {
  constructor(private prisma: PrismaService) {}

  @Post('report')
  async report(@Body() body: { reporterId?: string; videoId?: string; targetUserId?: string; reason: string }) {
    const report = await this.prisma.report.create({ data: body });
    return { id: report.id };
  }

  @Post('block')
  async block(@Body() body: { blockerId: string; blockedId: string }) {
    await this.prisma.userBlock.upsert({
      where: { blockerId_blockedId: { blockerId: body.blockerId, blockedId: body.blockedId } },
      create: { blockerId: body.blockerId, blockedId: body.blockedId },
      update: {},
    });
    return { ok: true };
  }

  @Post('mute')
  async mute(@Body() body: { muterId: string; mutedId: string }) {
    await this.prisma.userMute.upsert({
      where: { muterId_mutedId: { muterId: body.muterId, mutedId: body.mutedId } },
      create: { muterId: body.muterId, mutedId: body.mutedId },
      update: {},
    });
    return { ok: true };
  }
}
