import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { websiteContent } from '../../database/schema';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class WebsiteContentService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(websiteContent);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(websiteContent).where(eq(websiteContent.id, id));
    return rows[0] ?? null;
  }

  async findBySectionKey(sectionKey: string) {
    const rows = await this.db.select().top(1).from(websiteContent).where(eq(websiteContent.sectionKey, sectionKey));
    return rows[0] ?? null;
  }
}
