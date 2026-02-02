import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { receipts } from '../../database/models/receipts.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class ReceiptsService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(receipts);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(receipts).where(eq(receipts.id, id));
    return rows[0] ?? null;
  }

  async findByReceiptNumber(receiptNumber: string) {
    const rows = await this.db.select().top(1).from(receipts).where(eq(receipts.receiptNumber, receiptNumber));
    return rows[0] ?? null;
  }
}
