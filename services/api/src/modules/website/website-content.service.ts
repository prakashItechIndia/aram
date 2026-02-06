import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { websiteContent } from '../../database/models/website-content.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { CreateWebsiteContentDto } from './dto/create-website-content.dto';
import type { UpdateWebsiteContentDto } from './dto/update-website-content.dto';

@Injectable()
export class WebsiteContentService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) { }

  async findAll() {
    return this.db.select().from(websiteContent);
  }

  async findAllPaginated(page: number, limit: number) {
    const offset = (page - 1) * limit;

    // Get total count
    const allRecords = await this.db.select().from(websiteContent);
    const total = allRecords.length;

    // Get paginated data using raw SQL for SQL Server compatibility
    const data = await this.db.execute(
      `SELECT * FROM website_content 
       ORDER BY updated_at DESC 
       OFFSET ${offset} ROWS 
       FETCH NEXT ${limit} ROWS ONLY`
    );

    const rows = (data as any).recordset || (data as any).rows || [];

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(websiteContent).where(eq(websiteContent.id, id));
    return rows[0] ?? null;
  }

  async findBySectionKey(sectionKey: string) {
    const rows = await this.db.select().top(1).from(websiteContent).where(eq(websiteContent.sectionKey, sectionKey));
    return rows[0] ?? null;
  }

  async create(dto: CreateWebsiteContentDto) {
    const publishedAt = dto.status === 'Published' ? new Date() : null;

    // If making this one default, unset all others
    if (dto.isDefault) {
      await this.db.update(websiteContent).set({ isDefault: false });
    }

    await this.db.insert(websiteContent).values({
      sectionKey: dto.sectionKey,
      contentJson: dto.contentJson,
      version: dto.version ?? 1,
      name: dto.name ?? null,
      slug: dto.slug ?? null,
      status: dto.status ?? 'Draft',
      modifiedBy: dto.modifiedBy ?? null,
      publishedAt,
      updatedAt: new Date(),
      isDefault: dto.isDefault ?? false,
      publishReason: dto.publishReason ?? null,
    });
    const rows = await this.db
      .select()
      .top(1)
      .from(websiteContent)
      .orderBy(desc(websiteContent.id));
    const row = rows[0];
    if (!row) throw new NotFoundException('Website content not found after create');
    return row;
  }

  async update(id: number, dto: UpdateWebsiteContentDto) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Website content #${id} not found`);

    // If making this one default, unset all others first
    if (dto.isDefault === true) {
      await this.db.update(websiteContent).set({ isDefault: false });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (dto.sectionKey !== undefined) updates.sectionKey = dto.sectionKey;
    if (dto.contentJson !== undefined) updates.contentJson = dto.contentJson;
    if (dto.version !== undefined) updates.version = dto.version;
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.slug !== undefined) updates.slug = dto.slug;
    if (dto.status !== undefined) {
      updates.status = dto.status;
      // Set publishedAt when changing status to Published
      if (dto.status === 'Published' && existing.status !== 'Published') {
        updates.publishedAt = new Date();
      }
    }
    if (dto.modifiedBy !== undefined) updates.modifiedBy = dto.modifiedBy;
    if (dto.isDefault !== undefined) updates.isDefault = dto.isDefault;
    if (dto.publishReason !== undefined) updates.publishReason = dto.publishReason;

    await this.db.update(websiteContent).set(updates as Record<string, unknown>).where(eq(websiteContent.id, id));
    return this.findById(id);
  }

  async remove(id: number) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Website content #${id} not found`);
    await this.db.delete(websiteContent).where(eq(websiteContent.id, id));
    return { deleted: true, id };
  }
}
