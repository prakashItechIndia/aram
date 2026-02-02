import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { auditLog } from '../../database/schema';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class AuditService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(auditLog);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(auditLog).where(eq(auditLog.id, id));
    return rows[0] ?? null;
  }
}
