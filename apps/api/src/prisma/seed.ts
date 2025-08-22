import { PrismaClient, VideoStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.$transaction([
    prisma.user.upsert({ where: { username: 'alice' }, update: {}, create: { username: 'alice', displayName: 'Alice' } }),
    prisma.user.upsert({ where: { username: 'bob' }, update: {}, create: { username: 'bob', displayName: 'Bob' } }),
    prisma.user.upsert({ where: { username: 'carol' }, update: {}, create: { username: 'carol', displayName: 'Carol' } }),
  ]);

  const sound = await prisma.sound.create({ data: { title: 'Sample Sound', durationSec: 10 } });

  for (const u of users) {
    for (let i = 0; i < 3; i++) {
      const v = await prisma.video.create({
        data: {
          creatorId: u.id,
          soundId: sound.id,
          caption: `Video ${i} by ${u.username}`,
          status: VideoStatus.READY,
          eligibleForFeed: true,
        },
      });
      await prisma.videoAsset.createMany({
        data: [
          { videoId: v.id, kind: 'master', objectKey: `hls/${v.id}/master.m3u8` },
          { videoId: v.id, kind: 'poster', objectKey: `hls/${v.id}/poster.jpg` },
          { videoId: v.id, kind: 'waveform', objectKey: `hls/${v.id}/waveform.json` },
        ],
        skipDuplicates: true,
      });
    }
  }

  console.log('Seeded users, sound, and videos.');
}

main().finally(() => prisma.$disconnect());
