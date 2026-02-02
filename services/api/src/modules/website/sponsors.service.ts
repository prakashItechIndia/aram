import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { desc, eq, and, like, SQL } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { sponsors } from '../../database/models/sponsors.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { CreateSponsorDto } from './dto/create-sponsor.dto';
import type { UpdateSponsorDto } from './dto/update-sponsor.dto';

export interface SponsorFilters {
  tier?: string;
  contributionType?: string;
  status?: string;
  search?: string;
  featuredOnly?: boolean;
}

@Injectable()
export class SponsorsService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll(filters?: SponsorFilters) {
    const conditions: SQL[] = [];

    if (filters?.tier) {
      conditions.push(eq(sponsors.tier, filters.tier));
    }

    if (filters?.contributionType) {
      conditions.push(eq(sponsors.contributionType, filters.contributionType));
    }

    if (filters?.status === 'Active') {
      conditions.push(eq(sponsors.isActive, true));
    } else if (filters?.status === 'Inactive') {
      conditions.push(eq(sponsors.isActive, false));
    }

    if (filters?.search) {
      conditions.push(like(sponsors.name, `%${filters.search}%`));
    }

    if (filters?.featuredOnly) {
      conditions.push(eq(sponsors.featured, true));
    }

    const query = this.db.select().from(sponsors);
    
    if (conditions.length > 0) {
      return query.where(and(...conditions));
    }
    
    return query;
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(sponsors).where(eq(sponsors.id, id));
    return rows[0] ?? null;
  }

  async create(dto: CreateSponsorDto) {
    const displayStartDate = dto.displayStartDate ? new Date(dto.displayStartDate) : null;
    const displayEndDate = dto.displayEndDate ? new Date(dto.displayEndDate) : null;
    await this.db.insert(sponsors).values({
      name: dto.name,
      logoUrl: dto.logoUrl ?? null,
      websiteUrl: dto.websiteUrl ?? null,
      contributionType: dto.contributionType ?? null,
      tier: dto.tier ?? null,
      displayOrder: dto.displayOrder ?? 0,
      isActive: dto.isActive ?? true,
      showOnHomepage: dto.showOnHomepage ?? false,
      addedBy: dto.addedBy ?? null,
      featured: dto.featured ?? false,
      displayStartDate: displayStartDate ?? undefined,
      displayEndDate: displayEndDate ?? undefined,
    });
    const rows = await this.db.select().top(1).from(sponsors).orderBy(desc(sponsors.id));
    const row = rows[0];
    if (!row) throw new NotFoundException('Sponsor not found after create');
    return row;
  }

  async update(id: number, dto: UpdateSponsorDto) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Sponsor #${id} not found`);
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.logoUrl !== undefined) updates.logoUrl = dto.logoUrl;
    if (dto.websiteUrl !== undefined) updates.websiteUrl = dto.websiteUrl;
    if (dto.contributionType !== undefined) updates.contributionType = dto.contributionType;
    if (dto.tier !== undefined) updates.tier = dto.tier;
    if (dto.displayOrder !== undefined) updates.displayOrder = dto.displayOrder;
    if (dto.isActive !== undefined) updates.isActive = dto.isActive;
    if (dto.showOnHomepage !== undefined) updates.showOnHomepage = dto.showOnHomepage;
    if (dto.addedBy !== undefined) updates.addedBy = dto.addedBy;
    if (dto.featured !== undefined) updates.featured = dto.featured;
    if (dto.displayStartDate !== undefined) updates.displayStartDate = dto.displayStartDate ? new Date(dto.displayStartDate) : null;
    if (dto.displayEndDate !== undefined) updates.displayEndDate = dto.displayEndDate ? new Date(dto.displayEndDate) : null;
    await this.db.update(sponsors).set(updates as Record<string, unknown>).where(eq(sponsors.id, id));
    return this.findById(id);
  }

  async remove(id: number) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Sponsor #${id} not found`);
    await this.db.delete(sponsors).where(eq(sponsors.id, id));
    return { deleted: true, id };
  }
}
