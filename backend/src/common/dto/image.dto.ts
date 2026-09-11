import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Nested DTO for related images on properties and projects.
 *
 * This must be a real class used with `@Type(() => ImageDto)` on the parent DTO.
 * The pipeline sets `enableImplicitConversion: true`, so an inline
 * `images?: { url: string }[]` would have its `design:type` reflected as `Array`
 * and each element coerced into an empty array, silently turning
 * `[{ url }]` into `[[]]`.
 */
export class ImageDto {
  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsString()
  @IsOptional()
  publicId?: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
