import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service.js';
import { TestimonialsController } from './testimonials.controller.js';

@Module({
  controllers: [TestimonialsController],
  providers: [TestimonialsService],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}
