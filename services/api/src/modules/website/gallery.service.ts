import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { gallery } from '../../database/models/gallery.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class GalleryService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(gallery);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(gallery).where(eq(gallery.id, id));
    return rows[0] ?? null;
  }
}
