import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EnquiryType } from '../../common/types/prisma-enums.js';

export class CreateEnquiryDto {
  @IsEnum(EnquiryType)
  type!: EnquiryType;

  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  name!: string;

  @IsEmail({}, { message: 'Valid email address is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone!: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsNotEmpty({ message: 'Message or brief details required' })
  message!: string;

  @IsString()
  @IsOptional()
  budget?: string;

  @IsString()
  @IsOptional()
  projectType?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  serviceRequested?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  serviceId?: string;
}
