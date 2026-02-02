import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { sponsors } from '../../database/models/sponsors.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class SponsorsService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(sponsors);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(sponsors).where(eq(sponsors.id, id));
    return rows[0] ?? null;
  }
}
