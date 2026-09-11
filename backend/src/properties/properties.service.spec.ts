import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ListingType } from '../common/types/prisma-enums.js';

describe('PropertiesService', () => {
  let service: PropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: PrismaService,
          useValue: {
            property: null,
          },
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
  });

  it('should return initial sample properties', async () => {
    const res = await service.findAll({});
    expect(res).toBeDefined();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should filter properties by listingType', async () => {
    const res = await service.findAll({ listingType: ListingType.SALE });
    expect(res.data.every((p: any) => p.listingType === ListingType.SALE)).toBe(true);
  });

  it('should find property by slug', async () => {
    const all = await service.findAll({});
    const first = all.data[0];
    const found = await service.findBySlug(first.slug);
    expect(found).toBeDefined();
    expect(found.id).toBe(first.id);
  });
});
