import { IsBoolean, IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ListingType, PropertyStatus } from '../../common/types/prisma-enums.js';
import { Transform, Type } from 'class-transformer';

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

  /**
   * Reads the raw query string via `obj[key]`. The global `enableImplicitConversion`
   * has already coerced this value to a boolean by the time the callback runs, and
   * `Boolean('false')` is true — so checking `value` would make
   * `?isFeatured=false` behave as `?isFeatured=true`.
   */
  @Transform(({ obj, key }) => obj[key] === 'true' || obj[key] === true)
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

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
