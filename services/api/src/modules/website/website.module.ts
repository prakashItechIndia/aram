import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { S3Module } from '../s3/s3.module';
import { WebsiteContentService } from './website-content.service';
import { WebsiteContentController } from './website-content.controller';
import { SponsorsService } from './sponsors.service';
import { GalleryService } from './gallery.service';
import { GalleryAlbumsService } from './gallery-albums.service';
import { SponsorsController } from './sponsors.controller';
import { GalleryController } from './gallery.controller';
import { GalleryAlbumsController } from './gallery-albums.controller';

@Module({
  imports: [AuthModule, S3Module],
  controllers: [
    WebsiteContentController,
    SponsorsController,
    GalleryAlbumsController, // before GalleryController so /website/gallery/albums is not matched as gallery/:id
    GalleryController,
  ],
  providers: [WebsiteContentService, SponsorsService, GalleryService, GalleryAlbumsService],
  exports: [WebsiteContentService, SponsorsService, GalleryService, GalleryAlbumsService],
})
export class WebsiteModule {}
