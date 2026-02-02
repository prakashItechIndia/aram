import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module';
import { tDonorCategories } from '../../database/schema';
import { eq } from 'drizzle-orm';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

/** Uses existing DB table T_DONOR_CATEGORIES (PascalCase_Underscore columns). */
@Injectable()
export class DonationCategoriesService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll(includeInactive = false) {
    if (includeInactive) {
      return this.db.select().from(tDonorCategories);
    }
    return this.db.select().from(tDonorCategories).where(eq(tDonorCategories.isActive, true));
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(tDonorCategories).where(eq(tDonorCategories.id, id));
    return rows[0] ?? null;
  }
}
