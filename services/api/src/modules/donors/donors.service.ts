import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { tUser } from '../../database/models/t-user.model';
import { donors } from '../../database/models/donors.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { CreateGuestDonorDto } from './dto/create-guest-donor.dto';

/** User_Type value for donor/portal users (T_USER). */
const DONOR_USER_TYPE = 'Standard User';

/** Map T_USER row to donor-like shape for API (id, name, email, etc.). */
function mapTUserToDonor(row: typeof tUser.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    email: row.eMail,
    userName: row.userName,
    mobileNumber: row.mobileNumber,
    location: row.location,
    isActive: row.isActive,
    userType: row.userType,
    createdDate: row.createdDate,
  };
}

@Injectable()
export class DonorsService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  /** List users from T_USER where User_Type = Standard User (donors). */
  async findAll() {
    const rows = await this.db
      .select()
      .from(tUser)
      .where(and(eq(tUser.userType, DONOR_USER_TYPE), eq(tUser.isActive, true)));
    return rows.map(mapTUserToDonor);
  }

  /** Get user by Id from T_USER (any User_Type for admin lookup). */
  async findById(id: number) {
    const rows = await this.db.select().top(1).from(tUser).where(eq(tUser.id, id));
    const row = rows[0];
    return row ? mapTUserToDonor(row) : null;
  }

  /** Find donor by PAN (donors table only – T_USER has no PAN). Used to block repeat guest donations. */
  async findByPan(pan: string) {
    const normalized = (pan || '').trim().toUpperCase();
    if (!normalized) return null;
    try {
      const rows = await this.db.select().top(1).from(donors).where(eq(donors.pan, normalized));
      return rows[0] ?? null;
    } catch {
      return null;
    }
  }

  /** Find user by email from T_USER. Used for donors/me and donor portal. */
  async findByEmail(email: string) {
    const e = (email || '').trim().toLowerCase();
    if (!e) return null;
    const rows = await this.db.select().top(1).from(tUser).where(eq(tUser.eMail, e));
    const row = rows[0];
    return row ? mapTUserToDonor(row) : null;
  }

  /**
   * Create a guest donor (first-time "Donate without Signup").
   * Uses donors table when present (PAN); otherwise creates T_USER with User_Type = Standard User.
   */
  async createGuestOrReject(dto: CreateGuestDonorDto): Promise<{ donorId: number }> {
    const normalizedPan = dto.pan.trim().toUpperCase();
    const existingByPan = await this.findByPan(normalizedPan);
    if (existingByPan) {
      throw new ConflictException(
        'You have donated before. Please use Login to Donate.',
      );
    }
    const email = dto.email.trim().toLowerCase();
    const existingByEmail = await this.db
      .select()
      .top(1)
      .from(tUser)
      .where(eq(tUser.eMail, email));
    if (existingByEmail[0]) {
      throw new ConflictException(
        'An account with this email already exists. Please use Login to Donate.',
      );
    }
    const now = new Date();
    try {
      await this.db.insert(donors).values({
        name: dto.name.trim(),
        email,
        mobile: dto.mobile.trim(),
        address: dto.address.trim(),
        pan: normalizedPan,
        country: (dto.country || 'India').trim(),
        isGuest: true,
        totalDonated: '0',
        donationCount: 0,
        createdAt: now,
        updatedAt: now,
      } as any);
      const created = await this.findByPan(normalizedPan);
      if (!created) throw new Error('Failed to read created donor');
      return { donorId: created.id };
    } catch {
      await this.db.insert(tUser).values({
        name: dto.name.trim(),
        userType: DONOR_USER_TYPE,
        userName: email.replace(/@.*/, '') || dto.name.trim().replace(/\s+/g, ''),
        password: '',
        eMail: email,
        mobileNumber: dto.mobile.trim(),
        location: dto.address?.trim() ?? null,
        isActive: true,
        createdBy: 1,
        createdDate: now,
      });
      const rows = await this.db.select().top(1).from(tUser).where(eq(tUser.eMail, email));
      const inserted = rows[0];
      return { donorId: inserted?.id ?? 0 };
    }
  }
}
