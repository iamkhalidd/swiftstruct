import { Test, TestingModule } from '@nestjs/testing';
import { EnquiriesService } from './enquiries.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationService } from './notification.service.js';
import { EnquiryType } from '../common/types/prisma-enums.js';

describe('EnquiriesService', () => {
  let service: EnquiriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnquiriesService,
        {
          provide: PrismaService,
          useValue: {
            enquiry: null,
          },
        },
        {
          provide: NotificationService,
          useValue: {
            sendEnquiryNotification: async () => true,
          },
        },
      ],
    }).compile();

    service = module.get<EnquiriesService>(EnquiriesService);
  });

  it('should create new enquiry and return created enquiry', async () => {
    const res = await service.create({
      type: EnquiryType.GENERAL,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+234 800 000 0000',
      message: 'Hello, I want to inquire about consultancy.',
    });

    expect(res).toBeDefined();
    expect(res.name).toBe('John Doe');
  });
});
