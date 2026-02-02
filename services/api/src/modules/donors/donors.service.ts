import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { donors } from '../../database/schema';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { CreateGuestDonorDto } from './dto/create-guest-donor.dto';

@Injectable()
export class DonorsService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll() {
    return this.db.select().from(donors);
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(donors).where(eq(donors.id, id));
    return rows[0] ?? null;
  }

  /** Find donor by PAN (normalized uppercase). Used to block repeat guest donations. */
  async findByPan(pan: string) {
    const normalized = (pan || '').trim().toUpperCase();
    if (!normalized) return null;
    const rows = await this.db.select().top(1).from(donors).where(eq(donors.pan, normalized));
    return rows[0] ?? null;
  }

  /** Find donor by email. Used to pre-fill donation form for logged-in user. */
  async findByEmail(email: string) {
    const e = (email || '').trim().toLowerCase();
    if (!e) return null;
    const rows = await this.db.select().top(1).from(donors).where(eq(donors.email, e));
    return rows[0] ?? null;
  }

  /**
   * Create a guest donor (first-time "Donate without Signup").
   * Throws ConflictException if a donor with this PAN already exists.
   */
  async createGuestOrReject(dto: CreateGuestDonorDto): Promise<{ donorId: number }> {
    const normalizedPan = dto.pan.trim().toUpperCase();
    const existing = await this.findByPan(normalizedPan);
    if (existing) {
      throw new ConflictException(
        'You have donated before. Please use Login to Donate.',
      );
    }
    const now = new Date();
    const values = {
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      mobile: dto.mobile.trim(),
      address: dto.address.trim(),
      pan: normalizedPan,
      country: (dto.country || 'India').trim(),
      isGuest: true,
      totalDonated: '0',
      donationCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    await this.db.insert(donors).values(values as any);
    const created = await this.findByPan(normalizedPan);
    if (!created) throw new Error('Failed to read created donor');
    return { donorId: created.id };
  }
}
