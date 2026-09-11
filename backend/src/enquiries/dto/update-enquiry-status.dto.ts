import { IsEnum } from 'class-validator';
import { EnquiryStatus } from '../../common/types/prisma-enums.js';

export class UpdateEnquiryStatusDto {
  @IsEnum(EnquiryStatus)
  status!: EnquiryStatus;
}
