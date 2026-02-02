import { Module } from '@nestjs/common';
import { WebsiteContentService } from './website-content.service';
import { WebsiteContentController } from './website-content.controller';
import { SponsorsService } from './sponsors.service';
import { GalleryService } from './gallery.service';
import { SponsorsController } from './sponsors.controller';
import { GalleryController } from './gallery.controller';

@Module({
  controllers: [WebsiteContentController, SponsorsController, GalleryController],
  providers: [WebsiteContentService, SponsorsService, GalleryService],
  exports: [WebsiteContentService, SponsorsService, GalleryService],
})
export class WebsiteModule {}
