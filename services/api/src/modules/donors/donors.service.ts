import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { eq, and, sql, desc } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { tUser } from '../../database/models/t-user.model';
import { donors } from '../../database/models/donors.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { CreateGuestDonorDto } from './dto/create-guest-donor.dto';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { generateStrongPassword } from '../../common/utils/password.util';

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
  ) { }

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

    const donorInfo = { ...mapTUserToDonor(row), pan: null as string | null };

    // Try to fetch PAN and Address from donors table if they exist
    try {
      const donorRows = await this.db.select().top(1).from(donors).where(eq(donors.email, e));
      const donorDetail = donorRows[0];
      if (donorDetail) {
        // Fetch latest donation for preferences
        const lastDonation = await this.db
          .select({
            amount: schema.eChallans.amount,
            typeCode: schema.donationCategories.categoryCode,
          })
          .from(schema.eChallans)
          .leftJoin(
            schema.donationCategories,
            eq(schema.eChallans.categoryId, schema.donationCategories.id),
          )
          .where(eq(schema.eChallans.donorId, donorDetail.id))
          .orderBy(desc(schema.eChallans.id)); // Use ID for unambiguous chronological order

        const last = lastDonation[0];
        console.log('Last Donation fetched:', last);

        return {
          ...donorInfo,
          pan: donorDetail.pan || null,
          location: donorDetail.address || donorInfo.location,
          donationAmount: last ? last.amount : null,
          donationType: last ? last.typeCode : null,
        };
      }
    } catch (err) {
      console.error('Error fetching donor details:', err);
    }

    return donorInfo;
  }

  /**
   * Fetch all donations for a logged-in user from e_challans table.
   * Returns formatted donation history with receipt numbers, amounts, dates, etc.
   */
  async findDonationsByUserId(userId: number) {
    try {
      // First get the user's email to find their donor profile
      const userRows = await this.db.select().from(tUser).where(eq(tUser.id, userId));
      const user = userRows[0];
      if (!user?.eMail) return [];

      const email = user.eMail.trim().toLowerCase();

      // Find donor profile by email
      const donorRows = await this.db
        .select()
        .from(donors)
        .where(eq(donors.email, email));
      
      if (!donorRows[0]) return [];
      const donorId = donorRows[0].id;

      // Fetch all donations (e_challans) for this donor
      const donations = await this.db
        .select({
          id: schema.eChallans.id,
          challanNumber: schema.eChallans.challanNumber,
          amount: schema.eChallans.amount,
          donationDate: schema.eChallans.donationDate,
          paymentMode: schema.eChallans.paymentMode,
          categoryId: schema.eChallans.categoryId,
          categoryName: schema.donationCategories.displayName,
        })
        .from(schema.eChallans)
        .leftJoin(
          schema.donationCategories,
          eq(schema.eChallans.categoryId, schema.donationCategories.id),
        )
        .where(eq(schema.eChallans.donorId, donorId))
        .orderBy(sql`${schema.eChallans.donationDate} DESC`);

      // Format for frontend
      return donations.map((d) => ({
        id: d.id,
        receiptNo: d.challanNumber,
        amount: parseFloat(d.amount as any) || 0,
        date: d.donationDate ? new Date(d.donationDate).toISOString().split('T')[0] : '',
        type: d.categoryName || 'General Fund',
        status: 'Success',
        eligible80G: true, // Assuming all donations are 80G eligible
      }));
    } catch (err) {
      console.error('Error fetching donations:', err);
      return [];
    }
  }
  /**
   * Get aggregated donation summaries by Financial Year.
   * Used for 80G and Tax Document reports.
   */
  async getDonationSummaries(userId: number) {
    const donations = await this.findDonationsByUserId(userId);
    
    // Group by FY
    const summaries: Record<string, { totalAmount: number; count: number }> = {};

    donations.forEach(d => {
      const date = new Date(d.date);
      const month = date.getMonth(); // 0-11
      const year = date.getFullYear();
      
      // If month is Jan-Mar (0-2), it belongs to previous year's FY start
      // e.g. Jan 2025 is FY 2024-25
      const startYear = month < 3 ? year - 1 : year;
      const fyLabel = `FY ${startYear}-${(startYear + 1).toString().slice(-2)}`;

      if (!summaries[fyLabel]) {
        summaries[fyLabel] = { totalAmount: 0, count: 0 };
      }
      
      summaries[fyLabel].totalAmount += d.amount;
      summaries[fyLabel].count += 1;
    });

    // Convert to array
    return Object.entries(summaries).map(([year, data], index) => ({
      id: index + 1,
      year,
      generatedDate: new Date().toISOString().split('T')[0],
      totalAmount: data.totalAmount,
      type: 'Form 10BE', // Default type for tax docs
      fileName: `Doc_${year.replace(/\s/g, '_')}.pdf`
    })).sort((a, b) => b.year.localeCompare(a.year)); // Newest first
  }

  /**
   * Process a logged-in donation:
   * 1. Update T_USER personal details.
   * 2. Insert into T_EChallan.
   * 3. Create persistent notification.
   */
  async processDonation(userId: number, dto: any) {
    const now = new Date();

    // 1. Get User Email
    const userRows = await this.db.select().from(tUser).where(eq(tUser.id, userId));
    const user = userRows[0];
    if (!user?.eMail) throw new Error('User not found');

    // 2. Update T_USER personal details
    await this.db
      .update(tUser)
      .set({
        name: dto.name,
        location: dto.address,
      })
      .where(eq(tUser.id, userId));

    return this.recordDonationInternal(userId, user.eMail, dto);
  }

  /** Centralized logic for recording donation and notification. */
  private async recordDonationInternal(userId: number, email: string, dto: any) {
    const now = new Date();
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Ensure a record exists in 'donors' table and get its ID
    let donorId: number;
    const donorRows = await this.db
      .select()
      .from(donors)
      .where(eq(donors.email, normalizedEmail));

    if (donorRows[0]) {
      donorId = donorRows[0].id;
      // Update existing donor profile with latest details
      await this.db
        .update(donors)
        .set({
          name: dto.name,
          address: dto.address,
          country: dto.country,
          pan: dto.pan || donorRows[0].pan, // Keep existing PAN if not provided
          updatedAt: now,
        } as any)
        .where(eq(donors.id, donorId));
    } else {
      // Create new donor profile
      await this.db.insert(donors).values({
        name: dto.name,
        email: normalizedEmail,
        mobile: dto.mobile || '',
        address: dto.address,
        pan: dto.pan || '',
        country: dto.country || 'India',
        isGuest: false, // They have a T_USER account now
        totalDonated: '0',
        donationCount: 0,
        createdAt: now,
        updatedAt: now,
      } as any);

      const newDonorRows = await this.db
        .select()
        .from(donors)
        .where(eq(donors.email, normalizedEmail));
      if (!newDonorRows[0]) throw new Error('Failed to create donor profile');
      donorId = newDonorRows[0].id;
    }

    // 2. Find Category Id by categoryCode (frontend sends "aram-sei", "building", etc.)
    const catRows = await this.db
      .select()
      .from(schema.donationCategories)
      .where(eq(schema.donationCategories.categoryCode, dto.donationType));
    const categoryId = catRows[0]?.id || 1;

    // 3. Insert into e_challans using donorId (from donors table)
    const challanNumber = `CH${now.getTime()}`;
    await this.db.insert(schema.eChallans).values({
      challanNumber,
      donorId: donorId,
      amount: dto.amount.toString(),
      categoryId,
      paymentMode: 'Online',
      donationDate: now,
      createdByUserId: userId,
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
    // Create new user in T_USER
    // Generate temp pass based on PAN
    const tempPass = `Aram@${normalizedPan}`;
    
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

    const userRows = await this.db.select().from(tUser).where(eq(tUser.eMail, email));
    const inserted = userRows[0];
    if (!inserted) throw new Error('Failed to create account');

    // Send email
    await this.emailService.sendGuestWelcome(email, dto.name.trim(), tempPass);

    // Create persistent welcome notification
    await this.notificationsService.create({
      userId: inserted.id,
      type: 'info',
      title: 'Welcome to Aram',
      message: 'Thank you for your guest donation! Use your email and temporary password to login.',
    });

    // RECORD THE DONATION (this also creates the donors profile)
    await this.recordDonationInternal(inserted.id, email, {
      ...dto,
      pan: normalizedPan, // Use normalized PAN
    });

    return { donorId: inserted.id };
  }
}
