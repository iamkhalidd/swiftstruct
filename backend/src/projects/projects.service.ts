import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectQueryDto } from './dto/project-query.dto.js';
import { ProjectStatus } from '../common/types/prisma-enums.js';

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'The Crestwood Luxury Residences',
    slug: 'the-crestwood-luxury-residences-ikoyi',
    reference: 'SS-PRJ-201',
    description: 'Turnkey residential construction project comprising 8 luxury modern townhouses with subterranean parking, home automation, structural glazing, and high-spec architectural finishings.',
    location: 'Banana Island, Ikoyi, Lagos',
    projectType: 'Building & Construction',
    status: ProjectStatus.COMPLETED,
    scope: 'Full Structural Construction, Architectural Finishing, MEP Engineering, Landscaping, Smart Systems Installation',
    services: 'Building & Construction, Project Management, General Contracting',
    progressPercent: 100,
    startDate: new Date('2023-01-15'),
    completionDate: new Date('2024-06-30'),
    isFeatured: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      { id: 'pimg-1-1', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80', isPrimary: true, caption: 'Project Façade' },
      { id: 'pimg-1-2', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80', isPrimary: false, caption: 'Construction Site Progress' },
    ],
  },
  {
    id: 'proj-2',
    name: 'Apex Commercial Tower & Corporate Headquarters',
    slug: 'apex-commercial-tower-victoria-island',
    reference: 'SS-PRJ-202',
    description: '10-storey commercial tower development offering multi-tenant office floors, energy-efficient curtain walling, structural civil works, and integrated safety systems.',
    location: 'Victoria Island, Lagos',
    projectType: 'Commercial Construction',
    status: ProjectStatus.ONGOING,
    scope: 'Civil Structural Works, Structural Steel, Curtain Wall Installation, MEP Systems, Project Supervision',
    services: 'General Contracting, Project Management, Consultancy',
    progressPercent: 65,
    startDate: new Date('2023-11-01'),
    completionDate: new Date('2025-08-30'),
    isFeatured: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      { id: 'pimg-2-1', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', isPrimary: true, caption: 'Elevation Rendering' },
    ],
  },
  {
    id: 'proj-3',
    name: 'Heritage Estate Modernization & Renovation',
    slug: 'heritage-estate-modernization-renovation-lekki',
    reference: 'SS-PRJ-203',
    description: 'Complete interior and structural retrofit of a gated estate. Services encompassed structural strengthening, facade redesign, new MEP infrastructure, and smart access control.',
    location: 'Lekki Phase 1, Lagos',
    projectType: 'Renovation & Remodeling',
    status: ProjectStatus.COMPLETED,
    scope: 'Structural Retrofitting, Plumbing & Electrical Overhaul, Facade Renewal, Interior Architectural Joinery',
    services: 'Building & Construction, General Contracting',
    progressPercent: 100,
    startDate: new Date('2023-06-01'),
    completionDate: new Date('2023-12-20'),
    isFeatured: false,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      { id: 'pimg-3-1', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', isPrimary: true, caption: 'Renovated Interior' },
    ],
  },
  {
    id: 'proj-4',
    name: 'Metro Eco-Business Park Feasibility & Project Planning',
    slug: 'metro-eco-business-park-planning',
    reference: 'SS-PRJ-204',
    description: 'Pre-construction planning, site acquisition due diligence, environmental impact coordination, and master design framework for a 5-hectare mixed-use eco-industrial park.',
    location: 'Epe, Lagos State',
    projectType: 'Real Estate Consultancy & Project Planning',
    status: ProjectStatus.UPCOMING,
    scope: 'Development Feasibility Study, Land Acquisition Advisory, Masterplan Coordination, Project Budgeting',
    services: 'Real Estate Consultancy, Project Management',
    progressPercent: 15,
    startDate: new Date('2025-01-10'),
    completionDate: new Date('2026-03-31'),
    isFeatured: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      { id: 'pimg-4-1', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80', isPrimary: true, caption: 'Site Plan Overview' },
    ],
  },
];

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  private memoryProjects: any[] = [...INITIAL_PROJECTS];

  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  private generateReference(): string {
    return `SS-PRJ-${Math.floor(200 + Math.random() * 800)}`;
  }

  async findAll(query: ProjectQueryDto) {
    const { status, projectType, location, search, page = 1, limit = 12 } = query;

    if (this.prisma.project) {
      try {
        const where: any = {};
        if (status) where.status = status;
        else where.status = { not: ProjectStatus.ARCHIVED };

        if (projectType) where.projectType = { contains: projectType, mode: 'insensitive' };
        if (location) where.location = { contains: location, mode: 'insensitive' };

        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
          ];
        }

        const total = await this.prisma.project.count({ where });
        const projects = await this.prisma.project.findMany({
          where,
          include: { images: true },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        });

        return { data: projects, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
      } catch (err) {
        this.logger.warn('Database query error in projects.findAll', err);
      }
    }

    let filtered = [...this.memoryProjects];
    if (status) filtered = filtered.filter((p) => p.status === status);
    if (projectType) filtered = filtered.filter((p) => p.projectType.toLowerCase().includes(projectType.toLowerCase()));
    if (location) filtered = filtered.filter((p) => p.location.toLowerCase().includes(location.toLowerCase()));

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findBySlug(slug: string) {
    if (this.prisma.project) {
      try {
        const project = await this.prisma.project.findFirst({
          where: {
            OR: [{ slug }, { id: slug }],
          },
          include: { images: true },
        });
        if (project) return project;
      } catch (err) {
        this.logger.warn('Database error in findBySlug', err);
      }
    }

    const found = this.memoryProjects.find((p) => p.slug === slug || p.id === slug);
    if (!found) {
      throw new NotFoundException(`Project with slug or ID "${slug}" not found`);
    }
    return found;
  }

  async create(dto: CreateProjectDto) {
    const slug = this.generateSlug(dto.name);
    const reference = this.generateReference();

    if (this.prisma.project) {
      try {
        const project = await this.prisma.project.create({
          data: {
            name: dto.name,
            slug,
            reference,
            description: dto.description,
            location: dto.location,
            projectType: dto.projectType,
            status: dto.status || ProjectStatus.UPCOMING,
            scope: dto.scope,
            services: dto.services,
            progressPercent: dto.progressPercent || 0,
            startDate: dto.startDate ? new Date(dto.startDate) : null,
            completionDate: dto.completionDate ? new Date(dto.completionDate) : null,
            isFeatured: dto.isFeatured || false,
            publishedAt: new Date(),
            images: dto.images && dto.images.length > 0 ? { create: dto.images } : undefined,
          },
          include: { images: true },
        });
        return project;
      } catch (err) {
        this.logger.warn('Database error in project create', err);
      }
    }

    const newProject: any = {
      id: `proj-${Date.now()}`,
      name: dto.name,
      slug,
      reference,
      description: dto.description,
      location: dto.location,
      projectType: dto.projectType,
      status: dto.status || ProjectStatus.UPCOMING,
      scope: dto.scope || '',
      services: dto.services || '',
      progressPercent: dto.progressPercent || 0,
      startDate: dto.startDate || null,
      completionDate: dto.completionDate || null,
      isFeatured: dto.isFeatured || false,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      images: dto.images ? dto.images.map((img, i) => ({ id: `pimg-${Date.now()}-${i}`, ...img })) : [],
    };
    this.memoryProjects.unshift(newProject);
    return newProject;
  }

  async update(id: string, dto: UpdateProjectDto) {
    if (this.prisma.project) {
      try {
        const dataToUpdate: any = { ...dto };
        delete dataToUpdate.images;

        if (dto.images && dto.images.length > 0) {
          await this.prisma.projectImage.deleteMany({ where: { projectId: id } });
          dataToUpdate.images = { create: dto.images };
        }

        const project = await this.prisma.project.update({
          where: { id },
          data: dataToUpdate,
          include: { images: true },
        });
        return project;
      } catch (err) {
        this.logger.warn('Database error in project update', err);
      }
    }

    const index = this.memoryProjects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    const existingImages = this.memoryProjects[index].images || [];
    const updatedImages = dto.images
      ? dto.images.map((img, i) => ({ id: `pimg-${Date.now()}-${i}`, ...img }))
      : existingImages;

    const updated = {
      ...this.memoryProjects[index],
      ...dto,
      images: updatedImages,
      updatedAt: new Date(),
    };
    this.memoryProjects[index] = updated;
    return updated;
  }

  async remove(id: string) {
    if (this.prisma.project) {
      try {
        await this.prisma.project.delete({ where: { id } });
        return { message: 'Project deleted successfully' };
      } catch (err) {
        this.logger.warn('Database error in project delete', err);
      }
    }

    const index = this.memoryProjects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.memoryProjects.splice(index, 1);
    }
    return { message: 'Project deleted successfully' };
  }
}
