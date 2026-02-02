import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { eChallans } from '../../database/schema';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class EChallansService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(eChallans);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(eChallans).where(eq(eChallans.id, id));
    return rows[0] ?? null;
  }
}
