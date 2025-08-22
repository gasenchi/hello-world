import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error: any) {
      // In dev, allow API to start without DB; operations will still fail until DB is up
      // eslint-disable-next-line no-console
      console.warn('Prisma connect failed (dev mode proceed):', error?.message || error);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
