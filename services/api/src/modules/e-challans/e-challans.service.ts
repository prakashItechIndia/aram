import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc, and, gte, lte, like, isNull, sql } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { tEChallan } from '../../database/models/t-echallan.model';
import { tUser } from '../../database/models/t-user.model';
import { donors } from '../../database/models/donors.model';
import { tDonorCategories } from '../../database/models/t-donor-categories.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

export interface CreateEChallanDto {
  challanNumber: string;
  donorId: number;
  amount: number;
  categoryId?: number;
  paymentMode: string;
  chequeNumber?: string;
  donationDate: Date;
  receiptId?: number;
  createdBy: number;
}

export interface UpdateEChallanDto {
  challanNumber?: string;
  donorId?: number;
  amount?: number;
  categoryId?: number;
  paymentMode?: string;
  chequeNumber?: string;
  donationDate?: Date;
  receiptId?: number;
}

export interface EChallanFilters {
  donorId?: number;
  categoryId?: number;
  paymentMode?: string;
  fromDate?: Date;
  toDate?: Date;
  challanNumber?: string;
  createdBy?: number;
  hasReceipt?: boolean;
}

@Injectable()
export class EChallansService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  /**
   * Get all e-challans with optional filters and relationships
   */
  async findAll(filters?: EChallanFilters) {
    const conditions = [];

    if (filters?.donorId) {
      conditions.push(eq(tEChallan.donorId, filters.donorId));
    }
    if (filters?.categoryId) {
      conditions.push(eq(tEChallan.categoryId, filters.categoryId));
    }
    if (filters?.paymentMode) {
      conditions.push(eq(tEChallan.paymentMode, filters.paymentMode));
    }
    if (filters?.fromDate) {
      conditions.push(gte(tEChallan.donationDate, filters.fromDate));
    }
    if (filters?.toDate) {
      conditions.push(lte(tEChallan.donationDate, filters.toDate));
    }
    if (filters?.challanNumber) {
      conditions.push(like(tEChallan.challanNumber, `%${filters.challanNumber}%`));
    }
    if (filters?.createdBy) {
      conditions.push(eq(tEChallan.createdBy, filters.createdBy));
    }
    if (filters?.hasReceipt !== undefined) {
      conditions.push(filters.hasReceipt ? sql`${tEChallan.receiptId} IS NOT NULL` : isNull(tEChallan.receiptId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return this.db
      .select({
        echallan: tEChallan,
        createdByUser: {
          id: tUser.id,
          name: tUser.name,
          userType: tUser.userType,
          eMail: tUser.eMail,
        },
        donor: {
          id: donors.id,
          name: donors.name,
          email: donors.email,
          mobile: donors.mobile,
        },
        category: {
          id: tDonorCategories.id,
          donorTypes: tDonorCategories.donorTypes,
          donationCode: tDonorCategories.donationCode,
        },
      })
      .from(tEChallan)
      .leftJoin(tUser, eq(tEChallan.createdBy, tUser.id))
      .leftJoin(donors, eq(tEChallan.donorId, donors.id))
      .leftJoin(tDonorCategories, eq(tEChallan.categoryId, tDonorCategories.id))
      .where(whereClause)
      .orderBy(desc(tEChallan.createdDate));
  }

  /**
   * Get a single e-challan by ID with relationships
   */
  async findById(id: number) {
    const rows = await this.db
      .select({
        echallan: tEChallan,
        createdByUser: {
          id: tUser.id,
          name: tUser.name,
          userType: tUser.userType,
          eMail: tUser.eMail,
        },
        donor: {
          id: donors.id,
          name: donors.name,
          email: donors.email,
          mobile: donors.mobile,
          pan: donors.pan,
          address: donors.address,
        },
        category: {
          id: tDonorCategories.id,
          donorTypes: tDonorCategories.donorTypes,
          donationCode: tDonorCategories.donationCode,
        },
      })
      .from(tEChallan)
      .leftJoin(tUser, eq(tEChallan.createdBy, tUser.id))
      .leftJoin(donors, eq(tEChallan.donorId, donors.id))
      .leftJoin(tDonorCategories, eq(tEChallan.categoryId, tDonorCategories.id))
      .where(eq(tEChallan.id, id));

    if (!rows[0]) {
      throw new NotFoundException(`E-Challan with ID ${id} not found`);
    }

    return rows[0];
  }

  /**
   * Get e-challans by challan number
   */
  async findByChallanNumber(challanNumber: string) {
    return this.db
      .select()
      .from(tEChallan)
      .where(eq(tEChallan.challanNumber, challanNumber))
      .orderBy(desc(tEChallan.createdDate));
  }

  /**
   * Create a new e-challan
   */
  async create(dto: CreateEChallanDto) {
    await this.db.insert(tEChallan).values({
      challanNumber: dto.challanNumber,
      donorId: dto.donorId,
      amount: dto.amount.toString(),
      categoryId: dto.categoryId,
      paymentMode: dto.paymentMode,
      chequeNumber: dto.chequeNumber,
      donationDate: dto.donationDate,
      receiptId: dto.receiptId,
      createdBy: dto.createdBy,
      createdDate: new Date(),
    } as any);

    // Fetch the most recently created record with relationships
    const lastInserted = await this.db
      .select({ id: tEChallan.id })
      .from(tEChallan)
      .orderBy(desc(tEChallan.id));

    if (lastInserted[0]?.id) {
      return this.findById(lastInserted[0].id);
    }

    throw new Error('Failed to create e-challan');
  }

  /**
   * Update an existing e-challan
   */
  async update(id: number, dto: UpdateEChallanDto) {
    const existing = await this.db
      .select()
      .from(tEChallan)
      .where(eq(tEChallan.id, id));

    if (!existing[0]) {
      throw new NotFoundException(`E-Challan with ID ${id} not found`);
    }

    const updates: any = {};
    if (dto.challanNumber !== undefined) updates.challanNumber = dto.challanNumber;
    if (dto.donorId !== undefined) updates.donorId = dto.donorId;
    if (dto.amount !== undefined) updates.amount = dto.amount.toString();
    if (dto.categoryId !== undefined) updates.categoryId = dto.categoryId;
    if (dto.paymentMode !== undefined) updates.paymentMode = dto.paymentMode;
    if (dto.chequeNumber !== undefined) updates.chequeNumber = dto.chequeNumber;
    if (dto.donationDate !== undefined) updates.donationDate = dto.donationDate;
    if (dto.receiptId !== undefined) updates.receiptId = dto.receiptId;

    if (Object.keys(updates).length > 0) {
      await this.db
        .update(tEChallan)
        .set(updates)
        .where(eq(tEChallan.id, id));
    }

    return this.findById(id);
  }

  /**
   * Delete an e-challan (hard delete)
   */
  async remove(id: number) {
    const existing = await this.db
      .select()
      .from(tEChallan)
      .where(eq(tEChallan.id, id));

    if (!existing[0]) {
      throw new NotFoundException(`E-Challan with ID ${id} not found`);
    }

    await this.db.delete(tEChallan).where(eq(tEChallan.id, id));

    return { message: `E-Challan ${id} deleted successfully` };
  }

  /**
   * Link a receipt to an e-challan
   */
  async linkReceipt(id: number, receiptId: number) {
    return this.update(id, { receiptId });
  }

  /**
   * Get statistics for e-challans
   */
  async getStatistics(filters?: Pick<EChallanFilters, 'fromDate' | 'toDate' | 'categoryId'>) {
    const conditions = [];

    if (filters?.fromDate) {
      conditions.push(gte(tEChallan.donationDate, filters.fromDate));
    }
    if (filters?.toDate) {
      conditions.push(lte(tEChallan.donationDate, filters.toDate));
    }
    if (filters?.categoryId) {
      conditions.push(eq(tEChallan.categoryId, filters.categoryId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const stats = await this.db
      .select({
        totalCount: sql<number>`COUNT(*)`,
        totalAmount: sql<number>`ISNULL(SUM(CAST(${tEChallan.amount} AS DECIMAL(18,2))), 0)`,
        withReceipts: sql<number>`SUM(CASE WHEN ${tEChallan.receiptId} IS NOT NULL THEN 1 ELSE 0 END)`,
        withoutReceipts: sql<number>`SUM(CASE WHEN ${tEChallan.receiptId} IS NULL THEN 1 ELSE 0 END)`,
      })
      .from(tEChallan)
      .where(whereClause);

    return stats[0];
  }
}
