import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { createHash } from 'node:crypto';

const FOLDER = 'swiftstruct';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Issues the parameters the browser needs to upload a file straight to
   * Cloudinary. The api_secret never leaves the server — only the resulting
   * signature is returned.
   */
  getSignature() {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.error('Cloudinary credentials are missing; image uploads are unavailable.');
      throw new ServiceUnavailableException(
        'Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.',
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const params: Record<string, string | number> = { folder: FOLDER, timestamp };

    // Cloudinary signs the alphabetically sorted request params, excluding
    // file, cloud_name, api_key and signature, with the api_secret appended.
    const toSign = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    const signature = createHash('sha1').update(`${toSign}${apiSecret}`).digest('hex');

    return { signature, timestamp, cloudName, apiKey, folder: FOLDER };
  }

  /**
   * Lists the images that actually exist in the Cloudinary folder so the admin
   * media library reflects the CDN rather than a static placeholder.
   */
  async listAssets(maxResults = 100) {
    if (!this.isConfigured()) {
      this.logger.error('Cloudinary credentials are missing; media library is unavailable.');
      throw new ServiceUnavailableException(
        'Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.',
      );
    }

    try {
      const result: any = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
        prefix: FOLDER,
        max_results: maxResults,
      });

      const resources: any[] = result?.resources ?? [];

      return {
        total: result?.total_count ?? resources.length,
        assets: resources.map((asset) => ({
          publicId: asset.public_id,
          url: asset.secure_url,
          format: asset.format,
          width: asset.width,
          height: asset.height,
          bytes: asset.bytes,
          createdAt: asset.created_at,
        })),
      };
    } catch (err: any) {
      this.logger.error('Could not list Cloudinary assets', err);
      throw new ServiceUnavailableException(
        `Could not load the media library: ${err?.message || 'Cloudinary request failed'}`,
      );
    }
  }

  private isConfigured(): boolean {
    return Boolean(
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') &&
        this.configService.get<string>('CLOUDINARY_API_KEY') &&
        this.configService.get<string>('CLOUDINARY_API_SECRET'),
    );
  }
}
