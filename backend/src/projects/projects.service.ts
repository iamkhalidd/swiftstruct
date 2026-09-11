import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { CreateProjectUpdateDto } from './dto/create-project-update.dto.js';
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
      { id: 'pimg-1-1', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80', isPrimary: true, caption: 'Project Façade' },
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
    updates: [
      {
        id: 'pupd-2-2',
        projectId: 'proj-2',
        title: 'Curtain wall glazing 70% installed',
        description: 'Structural glazing to floors 4-7 completed. Floors 8-10 scheduled for next week, weather permitting.',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        progressPercent: 65,
        createdAt: new Date('2025-03-18'),
      },
      {
        id: 'pupd-2-1',
        projectId: 'proj-2',
        title: 'Superstructure topped out',
        description: 'Final concrete pour on the 10th floor slab completed. MEP first fix commencing across all levels.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        progressPercent: 45,
        createdAt: new Date('2025-01-22'),
      },
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
          include: {
            images: true,
            updates: { orderBy: { createdAt: 'desc' } },
          },
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
    return { ...found, updates: found.updates ?? [] };
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
      updates: [],
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

  // ---------------------------------------------------------------------------
  // Progress updates (site photos + milestone notes posted as work advances)
  // ---------------------------------------------------------------------------

  async listUpdates(projectId: string) {
    if (this.prisma.project) {
      try {
        return await this.prisma.projectUpdate.findMany({
          where: { projectId },
          orderBy: { createdAt: 'desc' },
        });
      } catch (err) {
        this.logger.warn('Database error in project listUpdates', err);
      }
    }

    const project = this.memoryProjects.find(
      (p) => p.id === projectId || p.slug === projectId,
    );
    return project?.updates ?? [];
  }

  /**
   * Posts a progress update. When the update carries a `progressPercent` the
   * parent project's own percentage is rolled forward in the same transaction,
   * so the portfolio card can never drift out of sync with the latest update.
   */
  async addUpdate(projectId: string, dto: CreateProjectUpdateDto) {
    if (this.prisma.project) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          const created = await tx.projectUpdate.create({
            data: {
              projectId,
              title: dto.title,
              description: dto.description,
              imageUrl: dto.imageUrl,
              publicId: dto.publicId,
              progressPercent: dto.progressPercent,
              ...(dto.createdAt ? { createdAt: new Date(dto.createdAt) } : {}),
            },
          });

          if (dto.progressPercent !== undefined) {
            await tx.project.update({
              where: { id: projectId },
              data: { progressPercent: dto.progressPercent },
            });
          }

          return created;
        });
      } catch (err) {
        this.logger.warn('Database error in project addUpdate', err);
      }
    }

    const project = this.memoryProjects.find(
      (p) => p.id === projectId || p.slug === projectId,
    );
    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }

    const update = {
      id: `pupd-${Date.now()}`,
      projectId: project.id,
      title: dto.title,
      description: dto.description ?? null,
      imageUrl: dto.imageUrl ?? null,
      publicId: dto.publicId ?? null,
      progressPercent: dto.progressPercent ?? null,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
    };

    project.updates = [update, ...(project.updates ?? [])];
    if (dto.progressPercent !== undefined) {
      project.progressPercent = dto.progressPercent;
    }
    project.updatedAt = new Date();

    return update;
  }

  async removeUpdate(projectId: string, updateId: string) {
    if (this.prisma.project) {
      try {
        // Scoped by projectId so an update can never be deleted through the
        // wrong project's route.
        const { count } = await this.prisma.projectUpdate.deleteMany({
          where: { id: updateId, projectId },
        });
        if (count === 0) {
          throw new NotFoundException(`Project update "${updateId}" not found`);
        }
        return { message: 'Project update deleted successfully' };
      } catch (err) {
        if (err instanceof NotFoundException) throw err;
        this.logger.warn('Database error in project removeUpdate', err);
      }
    }

    const project = this.memoryProjects.find(
      (p) => p.id === projectId || p.slug === projectId,
    );
    if (project) {
      project.updates = (project.updates ?? []).filter((u: any) => u.id !== updateId);
    }
    return { message: 'Project update deleted successfully' };
  }
}
