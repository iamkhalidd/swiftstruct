import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';
import { ProjectStatus } from '../../common/types/prisma-enums.js';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  projectType!: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  @IsOptional()
  services?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  progressPercent?: number;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  completionDate?: Date;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsOptional()
  images?: { url: string; publicId?: string; caption?: string; isPrimary?: boolean }[];
}
