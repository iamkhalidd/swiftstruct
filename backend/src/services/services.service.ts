import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export const OFFICIAL_SERVICES = [
  {
    id: 'srv-1',
    name: 'Real Estate Agency',
    slug: 'real-estate-agency',
    shortDescription: 'Professional property sales, rentals, property sourcing, and strategic marketing.',
    content: `SwiftStruct Real Estate Agency provides end-to-end representation for buyers, sellers, landlords, and tenants across prime residential and commercial real estate markets.

Our capabilities include:
• Property Sales: Marketing high-value residential and commercial properties to target buyers.
• Property Leasing & Rentals: Managing tenant placement and structured lease agreements.
• Property Sourcing: Identifying off-market and high-yield property opportunities.
• Property Marketing: High-impact digital and offline visual marketing strategies.
• Investment Sourcing: Aligning property acquisitions with long-term financial growth targets.`,
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    features: 'Property Sales, Leasing & Rentals, Property Sourcing, Property Marketing, Investment Sourcing',
    isPublished: true,
  },
  {
    id: 'srv-2',
    name: 'Real Estate Consultancy',
    slug: 'real-estate-consultancy',
    shortDescription: 'Data-driven real estate advisory, feasibility studies, valuation, and due diligence.',
    content: `Our consultancy services empower developers, corporate investors, and private clients to make informed property decisions based on market intelligence and financial analysis.

Our capabilities include:
• Property Investment Advisory: Capital deployment and portfolio optimization strategies.
• Market Research: Detailed real estate demand, supply, and yield analyses.
• Development Feasibility: Comprehensive financial modeling and structural risk assessment.
• Acquisition Advisory: Due diligence and technical acquisition support.
• Development Strategy: Structuring land assembly and phased master development plans.`,
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    features: 'Investment Advisory, Market Research, Feasibility Studies, Acquisition Advisory, Due Diligence',
    isPublished: true,
  },
  {
    id: 'srv-3',
    name: 'Building & Construction',
    slug: 'building-construction',
    shortDescription: 'Full-spectrum residential and commercial structural building and construction works.',
    content: `SwiftStruct delivers high-grade structural building construction, utilizing modern engineering methods, top-quality materials, and strict safety standards.

Our capabilities include:
• Residential Construction: Bespoke homes, luxury townhouses, and multi-unit developments.
• Commercial Construction: Office complexes, retail centers, and industrial facilities.
• New Builds: Complete ground-up structural construction.
• Renovation & Remodeling: Structural retrofits, facade modernization, and space reconfiguration.
• Civil & Structural Works: Foundation engineering, reinforced concrete frame construction.`,
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    features: 'Residential Construction, Commercial Construction, New Builds, Renovation, Structural Works',
    isPublished: true,
  },
  {
    id: 'srv-4',
    name: 'Project Management',
    slug: 'project-management',
    shortDescription: 'Structured project control, cost coordination, scheduling, and quality assurance.',
    content: `From inception to handover, SwiftStruct Project Management guarantees that real estate and construction developments stay on schedule, within budget, and compliant with safety specifications.

Our capabilities include:
• Project Planning & Scheduling: Detailed timeline control and milestone planning.
• Cost Coordination & Budgeting: Value engineering, cost monitoring, and financial auditing.
• Contractor Coordination: Managing specialist sub-contractors and vendor workflows.
• Site Supervision: On-site engineering control and daily execution compliance.
• Quality Control & Progress Reporting: Comprehensive milestone audits and transparent reporting.`,
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    features: 'Project Planning, Cost Coordination, Contractor Oversight, Site Supervision, Quality Control',
    isPublished: true,
  },
  {
    id: 'srv-5',
    name: 'General Contracting',
    slug: 'contracting',
    shortDescription: 'Comprehensive execution of turnkey construction contracts and procurement.',
    content: `SwiftStruct General Contracting manages the complete execution phase of construction projects, taking direct responsibility for materials procurement, site workforce management, and site safety.

Our capabilities include:
• Construction Contracts: Transparent, competitive, and robust contract management.
• Procurement & Logistics: Direct material sourcing and supply chain coordination.
• Subcontractor Coordination: Vetting, engaging, and managing skilled specialized trades.
• Civil & Building Execution: Site preparation, earthworks, masonry, and MEP installation.
• Project Delivery: On-time handover meeting exact structural specifications.`,
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    features: 'Construction Contracts, Procurement & Supply Chain, Subcontractor Oversight, Civil Execution',
    isPublished: true,
  },
];

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);
  private memoryServices: any[] = [...OFFICIAL_SERVICES];

  constructor(private prisma: PrismaService) {}

  async findAll() {
    if (this.prisma.service) {
      try {
        return await this.prisma.service.findMany({
          orderBy: { createdAt: 'asc' },
        });
      } catch (err) {
        this.logger.warn('Database error in services.findAll', err);
      }
    }
    return this.memoryServices;
  }

  async findBySlug(slug: string) {
    if (this.prisma.service) {
      try {
        const service = await this.prisma.service.findFirst({
          where: { OR: [{ slug }, { id: slug }] },
        });
        if (service) return service;
      } catch (err) {
        this.logger.warn('Database error in services.findBySlug', err);
      }
    }

    const found = this.memoryServices.find((s) => s.slug === slug || s.id === slug);
    if (!found) {
      throw new NotFoundException(`Service with slug "${slug}" not found`);
    }
    return found;
  }

  async update(id: string, data: any) {
    if (this.prisma.service) {
      try {
        return await this.prisma.service.update({
          where: { id },
          data,
        });
      } catch (err) {
        this.logger.warn('Database error in service update', err);
      }
    }

    const idx = this.memoryServices.findIndex((s) => s.id === id || s.slug === id);
    if (idx === -1) throw new NotFoundException('Service not found');
    this.memoryServices[idx] = { ...this.memoryServices[idx], ...data, updatedAt: new Date() };
    return this.memoryServices[idx];
  }
}
