import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  user: any = null;
  property: any = null;
  project: any = null;
  service: any = null;
  enquiry: any = null;
  insight: any = null;
  testimonial: any = null;
  media: any = null;

  async onModuleInit() {
    try {
      const prismaModule: any = await import('@prisma/client');
      const PrismaClientClass = prismaModule.PrismaClient || prismaModule.default?.PrismaClient;
      if (PrismaClientClass) {
        const client = new PrismaClientClass();
        await client.$connect();
        this.user = client.user;
        this.property = client.property;
        this.project = client.project;
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
