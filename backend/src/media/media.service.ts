import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || 'swiftstruct',
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY') || '1234567890',
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET') || 'secret',
    });
  }

  async getSignature() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || 'swiftstruct';
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY') || '1234567890';

    return {
      timestamp,
      cloudName,
      apiKey,
      folder: 'swiftstruct',
    };
  }
}
