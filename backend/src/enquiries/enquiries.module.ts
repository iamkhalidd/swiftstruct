import { Module } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service.js';
import { EnquiriesController } from './enquiries.controller.js';
import { NotificationService } from './notification.service.js';

@Module({
  controllers: [EnquiriesController],
  providers: [EnquiriesService, NotificationService],
  exports: [EnquiriesService],
})
export class EnquiriesModule {}
