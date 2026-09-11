import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, Min, ValidateNested } from 'class-validator';
import { ListingType, PropertyStatus } from '../../common/types/prisma-enums.js';
import { ImageDto } from '../../common/dto/image.dto.js';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  propertyType!: string;

  @IsEnum(ListingType)
  listingType!: ListingType;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  bedrooms!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  bathrooms!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  parkingSpaces!: number;

  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  amenities?: string;

  @IsString()
  @IsOptional()
  features?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];
}
