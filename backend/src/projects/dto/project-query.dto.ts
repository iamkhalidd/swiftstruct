import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ProjectStatus } from '../../common/types/prisma-enums.js';
import { Type } from 'class-transformer';

export class ProjectQueryDto {
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsString()
  @IsOptional()
  projectType?: string;

  @IsString()
  @IsOptional()
  location?: string;

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
