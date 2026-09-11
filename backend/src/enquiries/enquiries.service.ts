import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { UpdateEnquiryStatusDto } from './dto/update-enquiry-status.dto.js';
import { NotificationService } from './notification.service.js';
import { EnquiryStatus } from '../common/types/prisma-enums.js';

export const SAMPLE_ENQUIRIES = [
  {
    id: 'enq-1',
    type: 'PROPERTY',
    name: 'Oluwaseun Adebayo',
    email: 'o.adebayo@example.com',
    phone: '+234 802 123 4567',
    subject: 'Enquiry regarding 4 Bedroom Detached Duplex',
    message: 'I am interested in scheduling a physical inspection of the Lekki Phase 1 duplex this Friday.',
    status: EnquiryStatus.NEW,
    propertyId: 'prop-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'enq-2',
    type: 'PROJECT_BRIEF',
    name: 'Dr. Chidi Nnamdi',
    email: 'cnnamdi@investments.ng',
    phone: '+234 803 987 6543',
    subject: 'Project Brief: Commercial Plaza Construction',
    message: 'We are planning to build a 5-storey mixed-use commercial center in Victoria Island. We require full project management and contracting support.',
    budget: '₦500m - ₦1bn',
    projectType: 'Commercial Construction',
    location: 'Victoria Island, Lagos',
    serviceRequested: 'Building & Construction, Project Management',
    status: EnquiryStatus.CONTACTED,
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(),
  },
];

@Injectable()
export class EnquiriesService {
  private memoryEnquiries = [...SAMPLE_ENQUIRIES];

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateEnquiryDto) {
    let enquiry: any;
    try {
      if (this.prisma.enquiry) {
        enquiry = await this.prisma.enquiry.create({
          data: {
            type: dto.type,
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            subject: dto.subject,
            message: dto.message,
            budget: dto.budget,
            projectType: dto.projectType,
            location: dto.location,
            serviceRequested: dto.serviceRequested,
            status: EnquiryStatus.NEW,
            propertyId: dto.propertyId || null,
            projectId: dto.projectId || null,
            serviceId: dto.serviceId || null,
          },
        });
        await this.notificationService.sendEnquiryNotification(dto);
        return enquiry;
      }
    } catch {
      // Fallback
    }

    enquiry = {
      id: `enq-${Date.now()}`,
      ...dto,
      status: EnquiryStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memoryEnquiries.unshift(enquiry);
    await this.notificationService.sendEnquiryNotification(dto);
    return enquiry;
  }

  async findAll() {
    try {
      if (this.prisma.enquiry) {
        const enquiries = await this.prisma.enquiry.findMany({
          orderBy: { createdAt: 'desc' },
          include: { property: true, project: true, service: true },
        });
        if (enquiries.length > 0) return enquiries;
      }
    } catch {
      // Fallback
    }
    return this.memoryEnquiries;
  }

  async updateStatus(id: string, dto: UpdateEnquiryStatusDto) {
    try {
      if (this.prisma.enquiry) {
        const enquiry = await this.prisma.enquiry.update({
          where: { id },
          data: { status: dto.status },
        });
        return enquiry;
      }
    } catch {
      // Fallback
    }

    const found = this.memoryEnquiries.find((e) => e.id === id);
    if (!found) {
      throw new NotFoundException(`Enquiry with ID "${id}" not found`);
    }
    found.status = dto.status;
    found.updatedAt = new Date();
    return found;
  }
}
