import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { reconciliationBatches } from '../../database/models/reconciliation-batches.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class ReconciliationService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(reconciliationBatches);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(reconciliationBatches).where(eq(reconciliationBatches.id, id));
    return rows[0] ?? null;
  }
}
