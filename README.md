## Monorepo: API, Worker, Mobile, Shared

- apps/api: NestJS + Prisma + PostgreSQL + Redis + MinIO
- apps/worker: Node + fluent-ffmpeg, MinIO processing
- apps/mobile: Expo React Native (TypeScript)
- packages/shared: Shared TypeScript types

Prereqs: Node 18+, ffmpeg, docker, docker compose

Quickstart:
```
make dev
make migrate
make seed
```

Services:
- Postgres: localhost:5432 (app/app/app)
- Redis: localhost:6379
- MinIO: API :9000, Console :9001 (minio/minio12345)

# hello-world
Site seeing
