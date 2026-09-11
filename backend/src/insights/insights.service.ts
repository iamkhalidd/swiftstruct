import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export const INITIAL_INSIGHTS = [
  {
    id: 'ins-1',
    title: 'Integrated Real Estate and Project Delivery: The Modern Developer Advantage',
    slug: 'integrated-real-estate-and-project-delivery',
    excerpt: 'How uniting property sourcing, feasibility analysis, structural construction, and project management eliminates cost overruns and accelerates time-to-market.',
    content: `When property developers and real estate investors separate property acquisition from actual construction execution, friction inevitably emerges. Architectural designs frequently exceed actual financial budgets, construction contractors misinterpret original investor intentions, and timelines slip.

At SwiftStruct Limited, our integrated delivery model bridges the gap between real estate opportunity and actual construction delivery. By involving project managers, civil engineers, and property consultants from day one, we optimize design choices against current market pricing and actual constructability.`,
    featuredImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    category: 'Project Management',
    author: 'SwiftStruct Editorial Team',
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ins-2',
    title: 'Key Factors Driving Prime Residential Property Demand in Lagos',
    slug: 'prime-residential-property-demand-lagos',
    excerpt: 'An in-depth analysis of emerging real estate corridors in Ikoyi, Lekki Phase 1, and Victoria Island for high-net-worth real estate buyers and investors.',
    content: `Lagos real estate continues to show resilience across prime residential corridors. High demand for modern, fully automated apartments and secure gated developments has sustained solid rental yields and asset appreciation.

Key drivers include demand for integrated smart features, sustainable backup power solutions, private security infrastructure, and professional property management.`,
    featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    category: 'Real Estate Investment',
    author: 'SwiftStruct Advisory',
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

@Injectable()
export class InsightsService {
  private readonly logger = new Logger(InsightsService.name);
  private memoryInsights: any[] = [...INITIAL_INSIGHTS];

  constructor(private prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async findAll() {
    if (this.prisma.insight) {
      try {
        return await this.prisma.insight.findMany({
          orderBy: { createdAt: 'desc' },
        });
      } catch (err) {
        this.logger.warn('Database query error in insights.findAll', err);
      }
    }
    return this.memoryInsights;
  }

  async findBySlug(slug: string) {
    if (this.prisma.insight) {
      try {
        const article = await this.prisma.insight.findFirst({
          where: { OR: [{ slug }, { id: slug }] },
        });
        if (article) return article;
      } catch (err) {
        this.logger.warn('Database error in insights.findBySlug', err);
      }
    }

    const found = this.memoryInsights.find((i) => i.slug === slug || i.id === slug);
    if (!found) {
      throw new NotFoundException(`Insight article with slug "${slug}" not found`);
    }
    return found;
  }

  async create(data: any) {
    const slug = data.slug || this.generateSlug(data.title);

    if (this.prisma.insight) {
      try {
        return await this.prisma.insight.create({
          data: {
            title: data.title,
            slug,
            excerpt: data.excerpt,
            content: data.content,
            featuredImage: data.featuredImage,
            category: data.category || 'General',
            author: data.author || 'SwiftStruct Team',
            isPublished: data.isPublished !== undefined ? data.isPublished : true,
            publishedAt: new Date(),
          },
        });
      } catch (err) {
        this.logger.warn('Database error in insight create', err);
      }
    }

    const newArticle = {
      id: `ins-${Date.now()}`,
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      category: data.category || 'General',
      author: data.author || 'SwiftStruct Team',
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memoryInsights.unshift(newArticle);
    return newArticle;
  }

  async update(id: string, data: any) {
    if (this.prisma.insight) {
      try {
        return await this.prisma.insight.update({
          where: { id },
          data,
        });
      } catch (err) {
        this.logger.warn('Database error in insight update', err);
      }
    }

    const idx = this.memoryInsights.findIndex((i) => i.id === id);
    if (idx === -1) throw new NotFoundException('Insight not found');
    this.memoryInsights[idx] = { ...this.memoryInsights[idx], ...data, updatedAt: new Date() };
    return this.memoryInsights[idx];
  }

  async remove(id: string) {
    if (this.prisma.insight) {
      try {
        await this.prisma.insight.delete({ where: { id } });
        return { message: 'Insight deleted' };
      } catch (err) {
        this.logger.warn('Database error in insight delete', err);
      }
    }

    const idx = this.memoryInsights.findIndex((i) => i.id === id);
    if (idx !== -1) this.memoryInsights.splice(idx, 1);
    return { message: 'Insight deleted' };
  }
}
