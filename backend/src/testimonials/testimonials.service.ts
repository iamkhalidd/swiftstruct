import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TestimonialsService {
  private readonly logger = new Logger(TestimonialsService.name);
  private memoryTestimonials: any[] = [];

  constructor(private prisma: PrismaService) {}

  async findAll() {
    if (this.prisma.testimonial) {
      try {
        return await this.prisma.testimonial.findMany({
          orderBy: { createdAt: 'desc' },
        });
      } catch (err) {
        this.logger.warn('Database error in testimonials.findAll', err);
      }
    }
    return this.memoryTestimonials;
  }

  async create(data: any) {
    if (this.prisma.testimonial) {
      try {
        return await this.prisma.testimonial.create({
          data: {
            clientName: data.clientName,
            companyOrRole: data.companyOrRole,
            testimonial: data.testimonial,
            avatarUrl: data.avatarUrl,
            isPublished: data.isPublished !== undefined ? data.isPublished : true,
          },
        });
      } catch (err) {
        this.logger.warn('Database error in testimonial create', err);
      }
    }

    const item = {
      id: `tst-${Date.now()}`,
      clientName: data.clientName,
      companyOrRole: data.companyOrRole,
      testimonial: data.testimonial,
      avatarUrl: data.avatarUrl,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memoryTestimonials.unshift(item);
    return item;
  }

  async update(id: string, data: any) {
    if (this.prisma.testimonial) {
      try {
        return await this.prisma.testimonial.update({
          where: { id },
          data,
        });
      } catch (err) {
        this.logger.warn('Database error in testimonial update', err);
      }
    }

    const idx = this.memoryTestimonials.findIndex((t) => t.id === id);
    if (idx === -1) throw new NotFoundException('Testimonial not found');
    this.memoryTestimonials[idx] = { ...this.memoryTestimonials[idx], ...data, updatedAt: new Date() };
    return this.memoryTestimonials[idx];
  }

  async remove(id: string) {
    if (this.prisma.testimonial) {
      try {
        await this.prisma.testimonial.delete({ where: { id } });
        return { message: 'Testimonial deleted' };
      } catch (err) {
        this.logger.warn('Database error in testimonial delete', err);
      }
    }

    const idx = this.memoryTestimonials.findIndex((t) => t.id === id);
    if (idx !== -1) this.memoryTestimonials.splice(idx, 1);
    return { message: 'Testimonial deleted' };
  }
}
