import ffmpeg from 'fluent-ffmpeg';
import { Client as MinioClient } from 'minio';
import { PrismaClient, VideoStatus } from '@prisma/client';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const prisma = new PrismaClient();
const minio = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minio',
  secretKey: process.env.MINIO_SECRET_KEY || 'minio12345',
});
const bucket = process.env.MINIO_BUCKET || 'videos';

async function processRawUpload(objectKey: string) {
  const videoId = await ensureVideoForKey(objectKey);
  const tmpFile = path.join(os.tmpdir(), `${videoId}.mp4`);
  await new Promise<void>((resolve, reject) => {
    const w = fs.createWriteStream(tmpFile);
    minio.getObject(bucket, objectKey, (err, dataStream) => {
      if (err) return reject(err);
      dataStream.on('error', reject);
      dataStream.pipe(w);
      w.on('finish', () => resolve());
      w.on('error', reject);
    });
  });

  const outDir = path.join(os.tmpdir(), `hls-${videoId}`);
  fs.mkdirSync(outDir, { recursive: true });
  const masterName = 'master.m3u8';

  await new Promise<void>((resolve, reject) => {
    ffmpeg(tmpFile)
      .addOptions([
        '-preset veryfast',
        '-g 60',
        '-sc_threshold 0',
        '-keyint_min 60',
      ])
      .outputOptions([
        '-map 0:v:0',
        '-s:v:0 854x480',
        '-b:v:0 800k',
        '-map 0:v:0',
        '-s:v:1 1280x720',
        '-b:v:1 2500k',
        '-var_stream_map', 'v:0,name:480p v:1,name:720p',
        '-master_pl_name', masterName,
        '-hls_time 3',
        '-hls_playlist_type vod',
        '-hls_flags independent_segments',
        '-f hls',
      ])
      .output(path.join(outDir, 'variant_%v.m3u8'))
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });

  const posterPath = path.join(outDir, 'poster.jpg');
  await new Promise<void>((resolve, reject) => {
    ffmpeg(tmpFile)
      .seekInput(1)
      .frames(1)
      .output(posterPath)
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });

  const waveformPath = path.join(outDir, 'waveform.json');
  const waveform = { samples: [] as number[] };
  waveform.samples = Array.from({ length: 100 }, (_, i) => Math.sin(i / 10) * 0.5 + 0.5);
  fs.writeFileSync(waveformPath, JSON.stringify(waveform));

  async function uploadFile(local: string, key: string) {
    await minio.fPutObject(bucket, key, local, {});
  }
  const baseKey = `hls/${videoId}`;
  const files = fs.readdirSync(outDir);
  for (const f of files) {
    await uploadFile(path.join(outDir, f), `${baseKey}/${f}`);
  }

  await prisma.videoAsset.createMany({
    data: [
      { videoId, kind: 'master', objectKey: `${baseKey}/${masterName}` },
      { videoId, kind: 'poster', objectKey: `${baseKey}/poster.jpg` },
      { videoId, kind: 'waveform', objectKey: `${baseKey}/waveform.json` },
    ],
    skipDuplicates: true,
  });
  await prisma.video.update({ where: { id: videoId }, data: { status: VideoStatus.READY } });
}

async function ensureVideoForKey(objectKey: string): Promise<string> {
  const v = await prisma.video.create({ data: { creatorId: (await ensureUser()).id, caption: 'Upload', status: VideoStatus.UPLOADING } });
  return v.id;
}

async function ensureUser() {
  return prisma.user.upsert({ where: { username: 'uploader' }, update: {}, create: { username: 'uploader', displayName: 'Uploader' } });
}

async function main() {
  console.log('Worker started. Listening for MinIO events...');
  const notifier = minio.listenBucketNotification(bucket, 'raw-uploads/', '', ['s3:ObjectCreated:*']);
  notifier.on('notification', async (record) => {
    try {
      const key = record.s3.object.key as string;
      console.log('New upload:', key);
      await processRawUpload(key);
    } catch (e) {
      console.error('Processing error', e);
    }
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
