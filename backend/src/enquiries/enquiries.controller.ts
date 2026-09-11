import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service.js';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { UpdateEnquiryStatusDto } from './dto/update-enquiry-status.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/types/prisma-enums.js';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  async create(@Body() createEnquiryDto: CreateEnquiryDto) {
    return this.enquiriesService.create(createEnquiryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Get()
  async findAll() {
    return this.enquiriesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateEnquiryStatusDto,
  ) {
    return this.enquiriesService.updateStatus(id, updateStatusDto);
  }
}
