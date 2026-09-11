import { Controller, Get, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('signature')
  async getSignature() {
    return this.mediaService.getSignature();
  }

  @UseGuards(JwtAuthGuard)
  @Get('assets')
  async listAssets() {
    return this.mediaService.listAssets();
  }
}
