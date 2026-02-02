import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { adminNotifications } from '../../database/schema';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class NotificationsService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(adminNotifications);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(adminNotifications).where(eq(adminNotifications.id, id));
    return rows[0] ?? null;
  }
}
