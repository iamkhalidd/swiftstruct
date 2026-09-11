import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ListingType, PropertyStatus } from '../../common/types/prisma-enums.js';
import { Type } from 'class-transformer';

export class PropertyQueryDto {
  @IsEnum(ListingType)
  @IsOptional()
  listingType?: ListingType;

  @IsString()
  @IsOptional()
  propertyType?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  maxPrice?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  bedrooms?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  bathrooms?: number;

  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 12;
}
