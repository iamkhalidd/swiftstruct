import { Injectable, Logger } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendEnquiryNotification(enquiry: CreateEnquiryDto & { id?: string }) {
    // Configurable email / internal notification provider abstraction
    this.logger.log(
      `[NOTIFICATION] New ${enquiry.type} Enquiry from ${enquiry.name} (${enquiry.email}, ${enquiry.phone}). Subject: ${enquiry.subject || 'N/A'}`,
    );
    return true;
  }
}
