import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { tUser } from '../../database/models/t-user.model';
import { donors } from '../../database/models/donors.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { CreateGuestDonorDto } from './dto/create-guest-donor.dto';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';

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
  constructor(
    @Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
  ) {}

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
    if (!row) return null;

    const donorInfo = mapTUserToDonor(row);

    // Try to fetch PAN and Address from donors table if they exist
    try {
      const donorRows = await this.db.select().top(1).from(donors).where(eq(donors.email, e));
      const donorDetail = donorRows[0];
      if (donorDetail) {
        return {
          ...donorInfo,
          pan: donorDetail.pan,
          location: donorDetail.address || donorInfo.location, // Prefer donors table address
        };
      }
    } catch (err) {
      console.error('Error fetching donor details:', err);
    }

    return donorInfo;
  }

  /**
   * Process a logged-in donation:
   * 1. Update T_USER personal details.
   * 2. Insert into T_EChallan.
   * 3. Create persistent notification.
   */
  async processDonation(userId: number, dto: any) {
    const now = new Date();
    
    // 1. Update T_USER
    await this.db
      .update(tUser)
      .set({
        name: dto.name,
        location: dto.address,
      })
      .where(eq(tUser.id, userId));

    // Also update donors table if exists
    const userRows = await this.db.select().from(tUser).where(eq(tUser.id, userId));
    const user = userRows[0];
    if (user?.eMail) {
      await this.db
        .update(donors)
        .set({
          name: dto.name,
          address: dto.address,
          country: dto.country,
          updatedAt: now,
        } as any)
        .where(eq(donors.email, user.eMail));
    }

    // 2. Find Category Id
    const catRows = await this.db
      .select()
      .from(schema.tDonorCategories)
      .where(eq(schema.tDonorCategories.displayName, dto.donationType));
    const categoryId = catRows[0]?.id || 1;

    // 3. Insert into T_EChallan
    // Find max ID since it's not identity
    const maxIdRes = await this.db.select({ maxId: sql<number>`max(${schema.tEChallan.id})` }).from(schema.tEChallan);
    const nextId = (maxIdRes[0]?.maxId || 0) + 1;

    const challanNumber = `CH${now.getTime()}`;
    await this.db.insert(schema.tEChallan).values({
      id: nextId,
      challanNumber,
      donorId: userId,
      amount: dto.amount.toString(),
      categoryId,
      paymentMode: 'Online',
      donationDate: now,
      createdBy: userId,
      createdDate: now,
    });

    // 4. Create Notification
    await this.notificationsService.create({
      userId,
      type: 'success',
      title: 'Donated',
      message: `Thank you for your donation of ₹${dto.amount}! Transaction recorded as ${challanNumber}.`,
    });

    return { success: true, challanNumber };
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
        'You have donated before with this PAN. Please use Login to Donate.',
      );
    }
    
    // Check Mobile
    const mobile = dto.mobile.trim();
    const existingByMobile = await this.db
      .select()
      .top(1)
      .from(tUser)
      .where(eq(tUser.mobileNumber, mobile));
    
    if (existingByMobile[0]) {
       throw new ConflictException(
        'An account with this mobile number already exists. Please use Login to Donate.',
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
      // Create new user in T_USER
      // Generate temp pass
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
      let tempPass = '';
      for (let i = 0; i < 10; ++i) tempPass += charset.charAt(Math.floor(Math.random() * charset.length));
      
      const hashedPassword = Buffer.from(tempPass).toString('base64');

      await this.db.insert(tUser).values({
        name: dto.name.trim(),
        userType: DONOR_USER_TYPE,
        userName: email.replace(/@.*/, '') || dto.name.trim().replace(/\s+/g, ''),
        password: hashedPassword,
        eMail: email,
        mobileNumber: dto.mobile.trim(),
        location: dto.address?.trim() ?? null,
        isActive: true,
        createdBy: 1,
        createdDate: now,
      });

      // Send email
      await this.emailService.sendGuestWelcome(email, tempPass);

      // Create persistent notification for guest
      const userRows = await this.db.select().from(tUser).where(eq(tUser.eMail, email));
      if (userRows[0]) {
        await this.notificationsService.create({
          userId: userRows[0].id,
          type: 'info',
          title: 'Welcome to Aram',
          message: 'Thank you for your guest donation! Use your email and temporary password to login.',
        });
      }

      const rows = await this.db.select().top(1).from(tUser).where(eq(tUser.eMail, email));
      const inserted = rows[0];
      return { donorId: inserted?.id ?? 0 };
    }
  }
}
