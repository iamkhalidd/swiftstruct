import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { PropertiesModule } from './properties/properties.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { ServicesModule } from './services/services.module.js';
import { EnquiriesModule } from './enquiries/enquiries.module.js';
import { InsightsModule } from './insights/insights.module.js';
import { TestimonialsModule } from './testimonials/testimonials.module.js';
import { MediaModule } from './media/media.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    ProjectsModule,
    ServicesModule,
    EnquiriesModule,
    InsightsModule,
    TestimonialsModule,
    MediaModule,
  ],
})
export class AppModule {}
