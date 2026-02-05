import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { adminNotifications } from '../../database/models/admin-notifications.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class NotificationsService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) { }

  async create(data: { userId?: number; type: string; title: string; message: string }) {
    return this.db.insert(adminNotifications).values({
      ...data,
      createdAt: new Date(),
    });
  }

  async findAll(userId?: number, limit?: number) {
    if (userId !== undefined) {
      const baseQuery = limit 
        ? this.db.select().top(limit)
        : this.db.select();
      
      return baseQuery
        .from(adminNotifications)
        .where(eq(adminNotifications.userId, userId))
        .orderBy(adminNotifications.createdAt);
    }
    
    const baseQuery = limit
      ? this.db.select().top(limit)
      : this.db.select();
    
    return baseQuery
      .from(adminNotifications)
      .orderBy(adminNotifications.createdAt);
  }

  async findUnreadCount(userId: number) {
    const rows = await this.db
      .select()
      .from(adminNotifications)
      .where(and(eq(adminNotifications.userId, userId), isNull(adminNotifications.readAt)));
    return rows.length;
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(adminNotifications).where(eq(adminNotifications.id, id));
    return rows[0] ?? null;
  }

  async markAsRead(id: number) {
    return this.db
      .update(adminNotifications)
      .set({ readAt: new Date() })
      .where(eq(adminNotifications.id, id));
  }
}
