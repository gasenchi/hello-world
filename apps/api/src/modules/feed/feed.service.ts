import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';

interface Metrics {
  avgWatchPct: number;
  rewatchRate: number;
  likeRate: number;
  commentRate: number;
  shareRate: number;
  followAfterView: number;
  notInterestedRate: number;
  freshnessHours: number;
}

export function scoreVideo(m: Metrics): number {
  const freshnessDecay = Math.exp(-m.freshnessHours / 48); // 2-day half-life ish
  return (
    0.45 * m.avgWatchPct +
    0.2 * m.rewatchRate +
    0.15 * m.likeRate +
    0.07 * m.commentRate +
    0.07 * m.shareRate +
    0.06 * m.followAfterView -
    0.2 * m.notInterestedRate +
    freshnessDecay
  );
}

export function enforceDiversity(ids: string[], creators: string[], sounds: (string | null)[], windowSize = 5): number[] {
  const kept: number[] = [];
  const recentCreators: string[] = [];
  const recentSounds: (string | null)[] = [];
  for (let i = 0; i < ids.length; i++) {
    const creatorId = creators[i];
    const soundId = sounds[i];
    const creatorConflict = recentCreators.slice(-windowSize).includes(creatorId);
    const soundConflict = soundId ? recentSounds.slice(-windowSize).includes(soundId) : false;
    if (!creatorConflict && !soundConflict) {
      kept.push(i);
      recentCreators.push(creatorId);
      recentSounds.push(soundId);
    }
    if (kept.length >= 20) break;
  }
  return kept;
}

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService, private minio: MinioService) {}

  async getForYou(userId?: string) {
    const following = userId
      ? await this.prisma.follow.findMany({ where: { followerId: userId }, select: { followingId: true } })
      : [];
    const followingIds = new Set(following.map((f) => f.followingId));

    const recentGlobal = await this.prisma.video.findMany({
      where: { status: 'READY', eligibleForFeed: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { _count: { select: { likes: true, comments: true, shares: true, views: true } } },
    });

    const recentFollowing = followingIds.size
      ? await this.prisma.video.findMany({
          where: { status: 'READY', eligibleForFeed: true, creatorId: { in: Array.from(followingIds) } },
          orderBy: { createdAt: 'desc' },
          take: 200,
          include: { _count: { select: { likes: true, comments: true, shares: true, views: true } } },
        })
      : [];

    const candidates = [...recentFollowing, ...recentGlobal].reduce((map, v) => {
      map.set(v.id, v);
      return map;
    }, new Map<string, typeof recentGlobal[number]>());

    const scored = Array.from(candidates.values()).map((v) => {
      const views = Math.max(1, v._count.views);
      const likes = v._count.likes;
      const comments = v._count.comments;
      const shares = v._count.shares;
      const now = new Date().getTime();
      const freshnessHours = (now - new Date(v.createdAt).getTime()) / (1000 * 60 * 60);
      // Placeholder: assume avg watch and rewatch from views table later; use simple proxies
      const avgWatchPct = 0.5;
      const rewatchRate = 0.05;
      const likeRate = likes / views;
      const commentRate = comments / views;
      const shareRate = shares / views;
      const followAfterView = 0.02;
      const notInterestedRate = 0.0;
      const s = scoreVideo({
        avgWatchPct,
        rewatchRate,
        likeRate,
        commentRate,
        shareRate,
        followAfterView,
        notInterestedRate,
        freshnessHours,
      });
      return { v, s };
    });

    scored.sort((a, b) => b.s - a.s);
    const ids = scored.map((x) => x.v.id);
    const creators = scored.map((x) => x.v.creatorId);
    const sounds = scored.map((x) => x.v.soundId);
    const keptIdx = enforceDiversity(ids, creators, sounds, 5).slice(0, 20);
    const kept = keptIdx.map((i) => scored[i].v);

    // Build HLS URLs from assets
    const assetsByVideo = await this.prisma.videoAsset.findMany({
      where: { videoId: { in: kept.map((k) => k.id) } },
    });
    const byVideo: Record<string, Record<string, string>> = {};
    for (const a of assetsByVideo) {
      if (!byVideo[a.videoId]) byVideo[a.videoId] = {} as any;
      byVideo[a.videoId][a.kind] = a.objectKey;
    }

    const result: any[] = [];
    for (const k of kept) {
      const masterKey = byVideo[k.id]?.master ?? '';
      const posterKey = byVideo[k.id]?.poster ?? '';
      const waveformKey = byVideo[k.id]?.waveform ?? '';
      const masterUrl = masterKey ? await this.minio.presignGet(masterKey) : '';
      const posterUrl = posterKey ? await this.minio.presignGet(posterKey) : '';
      const waveformUrl = waveformKey ? await this.minio.presignGet(waveformKey) : '';
      result.push({
        id: k.id,
        creatorId: k.creatorId,
        soundId: k.soundId,
        caption: k.caption,
        likeCount: k._count?.likes ?? 0,
        commentCount: k._count?.comments ?? 0,
        shareCount: k._count?.shares ?? 0,
        viewCount: k._count?.views ?? 0,
        hls: { masterUrl, posterUrl, waveformUrl },
      });
    }
    return result;
  }
}