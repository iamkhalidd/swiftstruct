import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  user: any = null;
  property: any = null;
  propertyImage: any = null;
  project: any = null;
  projectImage: any = null;
  projectUpdate: any = null;
  service: any = null;
  enquiry: any = null;
  insight: any = null;
  testimonial: any = null;
  media: any = null;

  /** Raw client, kept so callers can run multi-write transactions. */
  private client: any = null;

  /**
   * Passthrough to Prisma's interactive transaction. Throws when the client is
   * not connected, which lets callers fall back to their in-memory store.
   */
  async $transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    if (!this.client) {
      throw new Error('Prisma client not connected');
    }
    return this.client.$transaction(fn);
  }

  async onModuleInit() {
    try {
      const prismaModule: any = await import('@prisma/client');
      const PrismaClientClass = prismaModule.PrismaClient || prismaModule.default?.PrismaClient;
      if (PrismaClientClass) {
        const client = new PrismaClientClass();
        await client.$connect();
        this.client = client;
        this.user = client.user;
        this.property = client.property;
        this.propertyImage = client.propertyImage;
        this.project = client.project;
        this.projectImage = client.projectImage;
        this.projectUpdate = client.projectUpdate;
        this.service = client.service;
        this.enquiry = client.enquiry;
        this.insight = client.insight;
        this.testimonial = client.testimonial;
        this.media = client.media;
        this.logger.log('Prisma connected to database successfully.');
      }
    } catch (error) {
      this.logger.warn('Prisma client not connected (using fallback mode):', error);
    }
  }

  async onModuleDestroy() {
    // Cleanup
  }
}
