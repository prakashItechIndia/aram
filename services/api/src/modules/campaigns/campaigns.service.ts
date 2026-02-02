import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { campaigns } from '../../database/models/campaigns.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class CampaignsService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(campaigns);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(campaigns).where(eq(campaigns.id, id));
    return rows[0] ?? null;
  }
}
