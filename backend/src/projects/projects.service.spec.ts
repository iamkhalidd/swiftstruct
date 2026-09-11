import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: {
            project: null,
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should return initial sample projects', async () => {
    const res = await service.findAll({});
    expect(res).toBeDefined();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find project by slug', async () => {
    const all = await service.findAll({});
    const first = all.data[0];
    const found = await service.findBySlug(first.slug);
    expect(found).toBeDefined();
    expect(found.id).toBe(first.id);
  });
});
