import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { gallery } from '../../database/models/gallery.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import type { UpdateGalleryItemDto } from './dto/update-gallery-item.dto';

@Injectable()
export class GalleryService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(gallery);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(gallery).where(eq(gallery.id, id));
    return rows[0] ?? null;
  }

  async create(dto: CreateGalleryItemDto) {
    await this.db.insert(gallery).values({
      title: dto.title,
      description: dto.description ?? null,
      altText: dto.altText ?? null,
      imagePath: dto.imagePath,
      albumId: dto.albumId ?? null,
      tagsJson: dto.tagsJson ?? null,
      sortOrder: dto.sortOrder ?? 0,
      caption: dto.caption ?? null,
      photographer: dto.photographer ?? null,
      visibility: dto.visibility ?? 'Public',
      fileSize: dto.fileSize ?? null,
      thumbnailPath: dto.thumbnailPath ?? null,
      uploadedBy: dto.uploadedBy ?? null,
      uploadedAt: new Date(),
      altTextGeneratedByAi: dto.altTextGeneratedByAi ?? false,
    });
    const rows = await this.db.select().top(1).from(gallery).orderBy(desc(gallery.id));
    const row = rows[0];
    if (!row) throw new NotFoundException('Gallery item not found after create');
    return row;
  }

  async update(id: number, dto: UpdateGalleryItemDto) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Gallery item #${id} not found`);
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.altText !== undefined) updates.altText = dto.altText;
    if (dto.imagePath !== undefined) updates.imagePath = dto.imagePath;
    if (dto.albumId !== undefined) updates.albumId = dto.albumId;
    if (dto.tagsJson !== undefined) updates.tagsJson = dto.tagsJson;
    if (dto.sortOrder !== undefined) updates.sortOrder = dto.sortOrder;
    if (dto.caption !== undefined) updates.caption = dto.caption;
    if (dto.photographer !== undefined) updates.photographer = dto.photographer;
    if (dto.visibility !== undefined) updates.visibility = dto.visibility;
    if (dto.fileSize !== undefined) updates.fileSize = dto.fileSize;
    if (dto.thumbnailPath !== undefined) updates.thumbnailPath = dto.thumbnailPath;
    if (dto.uploadedBy !== undefined) updates.uploadedBy = dto.uploadedBy;
    if (dto.altTextGeneratedByAi !== undefined) updates.altTextGeneratedByAi = dto.altTextGeneratedByAi;
    await this.db.update(gallery).set(updates as Record<string, unknown>).where(eq(gallery.id, id));
    return this.findById(id);
  }

  async remove(id: number) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Gallery item #${id} not found`);
    await this.db.delete(gallery).where(eq(gallery.id, id));
    return { deleted: true, id };
  }
}
