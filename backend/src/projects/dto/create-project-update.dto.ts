import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * A dated progress entry on a project. Posting one optionally records the
 * overall completion percentage at that moment, which also rolls up onto the
 * parent project so the portfolio card stays in sync with the latest update.
 */
export class CreateProjectUpdateDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  publicId?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  progressPercent?: number;
}
