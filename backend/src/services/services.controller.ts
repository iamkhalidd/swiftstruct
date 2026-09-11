import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/types/prisma-enums.js';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll() {
    return this.servicesService.findAll();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.servicesService.update(id, data);
  }
}
