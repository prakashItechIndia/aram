import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { desc, eq, count } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { galleryAlbums } from '../../database/models/gallery-albums.model';
import { gallery } from '../../database/models/gallery.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { CreateGalleryAlbumDto } from './dto/create-gallery-album.dto';
import type { UpdateGalleryAlbumDto } from './dto/update-gallery-album.dto';

@Injectable()
export class GalleryAlbumsService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) { }

  async findAll() {
    return this.db
      .select({
        id: galleryAlbums.id,
        name: galleryAlbums.name,
        coverImageUrl: galleryAlbums.coverImageUrl,
        imageCount: count(gallery.id),
        visibility: galleryAlbums.visibility,
        sortOrder: galleryAlbums.sortOrder,
        createdAt: galleryAlbums.createdAt,
        updatedAt: galleryAlbums.updatedAt,
      })
      .from(galleryAlbums)
      .leftJoin(gallery, eq(gallery.albumId, galleryAlbums.id))
      .groupBy(
        galleryAlbums.id,
        galleryAlbums.name,
        galleryAlbums.coverImageUrl,
        galleryAlbums.visibility,
        galleryAlbums.sortOrder,
        galleryAlbums.createdAt,
        galleryAlbums.updatedAt,
      );
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(galleryAlbums).where(eq(galleryAlbums.id, id));
    return rows[0] ?? null;
  }

  async create(dto: CreateGalleryAlbumDto) {
    await this.db.insert(galleryAlbums).values({
      name: dto.name,
      coverImageUrl: dto.coverImageUrl ?? null,
      imageCount: dto.imageCount ?? 0,
      visibility: dto.visibility ?? 'Public',
      sortOrder: dto.sortOrder ?? 0,
    });
    const rows = await this.db.select().top(1).from(galleryAlbums).orderBy(desc(galleryAlbums.id));
    const row = rows[0];
    if (!row) throw new NotFoundException('Gallery album not found after create');
    return row;
  }

  async update(id: number, dto: UpdateGalleryAlbumDto) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Gallery album #${id} not found`);
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.coverImageUrl !== undefined) updates.coverImageUrl = dto.coverImageUrl;
    if (dto.imageCount !== undefined) updates.imageCount = dto.imageCount;
    if (dto.visibility !== undefined) updates.visibility = dto.visibility;
    if (dto.sortOrder !== undefined) updates.sortOrder = dto.sortOrder;
    await this.db.update(galleryAlbums).set(updates as Record<string, unknown>).where(eq(galleryAlbums.id, id));
    return this.findById(id);
  }

  async remove(id: number) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Gallery album #${id} not found`);
    await this.db.delete(galleryAlbums).where(eq(galleryAlbums.id, id));
    return { deleted: true, id };
  }
}
