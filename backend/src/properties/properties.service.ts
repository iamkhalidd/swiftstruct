import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { PropertyQueryDto } from './dto/property-query.dto.js';
import { ListingType, PropertyStatus } from '../common/types/prisma-enums.js';

export const INITIAL_PROPERTIES = [
  {
    id: 'prop-1',
    title: '4 Bedroom Detached Duplex with Swimming Pool',
    slug: '4-bedroom-detached-duplex-lekki-lagos',
    reference: 'SS-PROP-101',
    description: 'Contemporary 4 bedroom detached duplex featuring high-ceiling living areas, fully fitted modern kitchen, private swimming pool, smart home automation, and ample parking space in a gated estate.',
    propertyType: 'Detached Duplex',
    listingType: ListingType.SALE,
    price: 185000000,
    currency: 'NGN',
    location: 'Lekki Phase 1',
    city: 'Lekki',
    state: 'Lagos',
    bedrooms: 4,
    bathrooms: 5,
    parkingSpaces: 3,
    status: PropertyStatus.AVAILABLE,
    isFeatured: true,
    totalUnits: 1,
    availableUnits: 1,
    amenities: 'Swimming Pool, 24/7 Security, Smart Home Automation, Fitted Kitchen, CCTV, Balcony, Water Treatment',
    features: 'High Ceilings, Premium Marble Flooring, En-suite Bedrooms, Walk-in Closet, Generator House',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      { id: 'img-1-1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', isPrimary: true, caption: 'Exterior View' },
      { id: 'img-1-2', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', isPrimary: false, caption: 'Living Room' },
    ],
  },
  {
    id: 'prop-2',
    title: 'Luxury 3 Bedroom Apartment with Ocean View',
    slug: 'luxury-3-bedroom-apartment-victoria-island-lagos',
    reference: 'SS-PROP-102',
    description: 'Exquisite 3 bedroom oceanfront apartment offering panoramic Atlantic views, premium floor-to-ceiling glass paneling, fitness center access, concierge services, and 24-hour backup power.',
    propertyType: 'Apartment',
    listingType: ListingType.RENT,
    price: 15000000,
    currency: 'NGN',
    location: 'Victoria Island',
    city: 'Lagos Island',
    state: 'Lagos',
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    status: PropertyStatus.AVAILABLE,
    isFeatured: true,
    totalUnits: 24,
    availableUnits: 6,
    amenities: 'Ocean View, Elevator, Gym, Swimming Pool, Concierge Service, Underground Parking',
    features: 'Floor to Ceiling Windows, Fitted Italian Kitchen, Centralized Air Conditioning',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      { id: 'img-2-1', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', isPrimary: true, caption: 'Building Façade' },
      { id: 'img-2-2', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', isPrimary: false, caption: 'Interior Lounge' },
    ],
  },
  {
    id: 'prop-3',
    title: 'Commercial Office Space in Prime Business District',
    slug: 'commercial-office-space-ikeja-gra-lagos',
    reference: 'SS-PROP-103',
    description: 'Open-plan commercial office building covering 450 sqm across two floors in the commercial hub of Ikeja GRA. Ideal for corporate headquarters, financial firms, or project offices.',
    propertyType: 'Commercial Space',
    listingType: ListingType.RENT,
    price: 25000000,
    currency: 'NGN',
    location: 'Ikeja GRA',
    city: 'Ikeja',
    state: 'Lagos',
    bedrooms: 0,
    bathrooms: 6,
    parkingSpaces: 10,
    status: PropertyStatus.AVAILABLE,
    isFeatured: false,
    totalUnits: 12,
    availableUnits: 4,
    amenities: 'Fiber Optic Internet Ready, Dedicated Substation, High Capacity Generator, 24/7 Security',
    features: 'Flexible Layout, Executive Boardroom, Modern Washrooms, Kitchenette',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      { id: 'img-3-1', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', isPrimary: true, caption: 'Office Space' },
    ],
  },
  {
    id: 'prop-4',
    title: '5 Bedroom Fully Automated Mansion',
    slug: '5-bedroom-fully-automated-mansion-ikoyi-lagos',
    reference: 'SS-PROP-104',
    description: 'Ultra-luxurious 5 bedroom mansion set on 1,000 sqm of prime Ikoyi real estate. Features elevator, private cinema room, rooftop terrace lounge, double volume foyer, and staff quarters.',
    propertyType: 'Mansion',
    listingType: ListingType.SALE,
    price: 650000000,
    currency: 'NGN',
    location: 'Ikoyi',
    city: 'Ikoyi',
    state: 'Lagos',
    bedrooms: 5,
    bathrooms: 6,
    parkingSpaces: 6,
    status: PropertyStatus.AVAILABLE,
    isFeatured: true,
    totalUnits: 1,
    availableUnits: 1,
    amenities: 'Elevator, Private Cinema, Swimming Pool, Rooftop Lounge, 2-Room BQ, Underground Wine Cellar',
    features: 'Smart Home Automation, Double Volume Living Room, Chef Kitchen, Solar Power System',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      { id: 'img-4-1', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', isPrimary: true, caption: 'Mansion Exterior' },
    ],
  },
];

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);
  private memoryProperties: any[] = [...INITIAL_PROPERTIES];

  constructor(private prisma: PrismaService) {}

  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  private generateReference(): string {
    return `SS-PROP-${Math.floor(100 + Math.random() * 900)}`;
  }

  /**
   * Keeps unit inventory coherent: `availableUnits` can never exceed
   * `totalUnits`, and neither can go negative. Applied on both create and
   * update so bad numbers can't reach the database from any caller.
   */
  private resolveUnits(
    totalInput?: number,
    availableInput?: number,
    currentTotal = 1,
    currentAvailable = 1,
  ) {
    const totalUnits = Math.max(1, totalInput ?? currentTotal);
    const availableUnits = Math.max(
      0,
      Math.min(availableInput ?? currentAvailable, totalUnits),
    );
    return { totalUnits, availableUnits };
  }

  async findAll(query: PropertyQueryDto) {
    const {
      listingType,
      propertyType,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      status,
      search,
      page = 1,
      limit = 12,
    } = query;

    if (this.prisma.property) {
      try {
        const where: any = {};
        if (listingType) where.listingType = listingType;
        if (propertyType) where.propertyType = { contains: propertyType, mode: 'insensitive' };
        if (location) where.location = { contains: location, mode: 'insensitive' };
        if (status) where.status = status;
        else where.status = { not: PropertyStatus.ARCHIVED };

        if (minPrice || maxPrice) {
          where.price = {};
          if (minPrice) where.price.gte = minPrice;
          if (maxPrice) where.price.lte = maxPrice;
        }

        if (bedrooms) where.bedrooms = { gte: bedrooms };
        if (bathrooms) where.bathrooms = { gte: bathrooms };

        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
          ];
        }

        const total = await this.prisma.property.count({ where });
        const properties = await this.prisma.property.findMany({
          where,
          include: { images: true },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        });

        return { data: properties, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
      } catch (err) {
        this.logger.warn('Database query error in properties.findAll, fallback active', err);
      }
    }

    let filtered = [...this.memoryProperties];
    if (listingType) filtered = filtered.filter((p) => p.listingType === listingType);
    if (propertyType) filtered = filtered.filter((p) => p.propertyType.toLowerCase().includes(propertyType.toLowerCase()));
    if (location) filtered = filtered.filter((p) => p.location.toLowerCase().includes(location.toLowerCase()));
    if (status) filtered = filtered.filter((p) => p.status === status);
    if (minPrice) filtered = filtered.filter((p) => p.price >= minPrice);
    if (maxPrice) filtered = filtered.filter((p) => p.price <= maxPrice);
    if (bedrooms) filtered = filtered.filter((p) => p.bedrooms >= bedrooms);
    if (bathrooms) filtered = filtered.filter((p) => p.bathrooms >= bathrooms);

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
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
    if (this.prisma.property) {
      try {
        const property = await this.prisma.property.findFirst({
          where: {
            OR: [{ slug }, { id: slug }],
          },
          include: { images: true },
        });
        if (property) return property;
      } catch (err) {
        this.logger.warn('Database error in findBySlug', err);
      }
    }

    const found = this.memoryProperties.find((p) => p.slug === slug || p.id === slug);
    if (!found) {
      throw new NotFoundException(`Property with slug or ID "${slug}" not found`);
    }
    return found;
  }

  async create(dto: CreatePropertyDto) {
    const slug = this.generateSlug(dto.title);
    const reference = this.generateReference();
    const { totalUnits, availableUnits } = this.resolveUnits(
      dto.totalUnits,
      dto.availableUnits,
    );

    if (this.prisma.property) {
      try {
        const property = await this.prisma.property.create({
          data: {
            title: dto.title,
            slug,
            reference,
            description: dto.description,
            propertyType: dto.propertyType,
            listingType: dto.listingType,
            price: dto.price,
            currency: dto.currency || 'NGN',
            location: dto.location,
            city: dto.city,
            state: dto.state,
            bedrooms: dto.bedrooms,
            bathrooms: dto.bathrooms,
            parkingSpaces: dto.parkingSpaces,
            status: dto.status || PropertyStatus.AVAILABLE,
            isFeatured: dto.isFeatured || false,
            totalUnits,
            availableUnits,
            amenities: dto.amenities,
            features: dto.features,
            publishedAt: new Date(),
            images: dto.images && dto.images.length > 0
              ? { create: dto.images }
              : undefined,
          },
          include: { images: true },
        });
        return property;
      } catch (err) {
        this.logger.warn('Database error in property create', err);
      }
    }

    const newProperty: any = {
      id: `prop-${Date.now()}`,
      title: dto.title,
      slug,
      reference,
      description: dto.description,
      propertyType: dto.propertyType,
      listingType: dto.listingType,
      price: dto.price,
      currency: dto.currency || 'NGN',
      location: dto.location,
      city: dto.city,
      state: dto.state,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      parkingSpaces: dto.parkingSpaces,
      status: dto.status || PropertyStatus.AVAILABLE,
      isFeatured: dto.isFeatured || false,
      totalUnits,
      availableUnits,
      amenities: dto.amenities || '',
      features: dto.features || '',
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      images: dto.images ? dto.images.map((img, i) => ({ id: `img-${Date.now()}-${i}`, ...img })) : [],
    };
    this.memoryProperties.unshift(newProperty);
    return newProperty;
  }

  async update(id: string, dto: UpdatePropertyDto) {
    if (this.prisma.property) {
      try {
        const dataToUpdate: any = { ...dto };
        delete dataToUpdate.images;

        if (dto.totalUnits !== undefined || dto.availableUnits !== undefined) {
          const current = await this.prisma.property.findUnique({
            where: { id },
            select: { totalUnits: true, availableUnits: true },
          });
          Object.assign(
            dataToUpdate,
            this.resolveUnits(
              dto.totalUnits,
              dto.availableUnits,
              current?.totalUnits ?? 1,
              current?.availableUnits ?? 1,
            ),
          );
        }

        if (dto.images && dto.images.length > 0) {
          await this.prisma.propertyImage.deleteMany({ where: { propertyId: id } });
          dataToUpdate.images = { create: dto.images };
        }

        const property = await this.prisma.property.update({
          where: { id },
          data: dataToUpdate,
          include: { images: true },
        });
        return property;
      } catch (err) {
        this.logger.warn('Database error in property update', err);
      }
    }

    const index = this.memoryProperties.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Property with ID "${id}" not found`);
    }

    const existingImages = this.memoryProperties[index].images || [];
    const updatedImages = dto.images
      ? dto.images.map((img, i) => ({ id: `img-${Date.now()}-${i}`, ...img }))
      : existingImages;

    const units =
      dto.totalUnits !== undefined || dto.availableUnits !== undefined
        ? this.resolveUnits(
            dto.totalUnits,
            dto.availableUnits,
            this.memoryProperties[index].totalUnits ?? 1,
            this.memoryProperties[index].availableUnits ?? 1,
          )
        : {};

    const updated = {
      ...this.memoryProperties[index],
      ...dto,
      ...units,
      images: updatedImages,
      updatedAt: new Date(),
    };
    this.memoryProperties[index] = updated;
    return updated;
  }

  async remove(id: string) {
    if (this.prisma.property) {
      try {
        await this.prisma.property.delete({ where: { id } });
        return { message: 'Property deleted successfully' };
      } catch (err) {
        this.logger.warn('Database error in property delete', err);
      }
    }

    const index = this.memoryProperties.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.memoryProperties.splice(index, 1);
    }
    return { message: 'Property deleted successfully' };
  }
}
