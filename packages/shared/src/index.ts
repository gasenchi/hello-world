export enum VideoStatus {
  UPLOADING = 'UPLOADING',
  READY = 'READY',
  BLOCKED = 'BLOCKED',
}

export type EntityId = string;

export interface SignedUrlResponse {
  url: string;
  key: string;
}

export interface HlsAsset {
  masterUrl: string;
  posterUrl: string;
  waveformUrl: string;
}

export interface FeedVideoDTO {
  id: EntityId;
  creatorId: EntityId;
  soundId: EntityId | null;
  caption: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  hls: HlsAsset;
}

export type FeedMode = 'for-you';
