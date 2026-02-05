import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { eq, and, sql, desc, like } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { tUser } from '../../database/models/t-user.model';
import { donors } from '../../database/models/donors.model';
import { eChallans } from '../../database/models/e-challans.model';
import { donationCategories } from '../../database/models/donation-categories.model';
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
            amount: eChallans.amount,
            typeCode: donationCategories.categoryCode,
          })
          .from(eChallans)
          .leftJoin(
            donationCategories,
            eq(eChallans.categoryId, donationCategories.id),
          )
          .where(eq(eChallans.donorId, donorDetail.id))
          .orderBy(desc(eChallans.id)); // Use ID for unambiguous chronological order

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
   * Supports filtering by receipt number, financial year, and donation type.
   * Supports pagination with page and limit parameters.
   */
  async findDonationsByUserId(
    userId: number,
    query?: {
      searchReceipt?: string;
      financialYear?: string;
      donationType?: string;
      page?: number;
      limit?: number;
    }
  ) {
    try {
      // First get the user's email to find their donor profile
      const userRows = await this.db.select().from(tUser).where(eq(tUser.id, userId));
      const user = userRows[0];
      if (!user?.eMail) return { data: [], total: 0 };

      const email = user.eMail.trim().toLowerCase();

      // Find donor profile by email
      const donorRows = await this.db
        .select()
        .from(donors)
        .where(eq(donors.email, email));

      if (!donorRows[0]) return { data: [], total: 0 };
      const donorId = donorRows[0].id;

      // Build WHERE conditions
      const conditions: any[] = [eq(eChallans.donorId, donorId)];

      // Filter by receipt number (search)
      if (query?.searchReceipt) {
        conditions.push(sql`${eChallans.challanNumber} LIKE ${`%${query.searchReceipt}%`}`);
      }

      // Filter by financial year
      if (query?.financialYear) {
        const [startYearStr] = query.financialYear.replace('fy', '').split('-');
        const startYear = parseInt(startYearStr, 10);
        const fyStart = new Date(`${startYear}-04-01`);
        const fyEnd = new Date(`${startYear + 1}-03-31T23:59:59`);
        conditions.push(sql`${eChallans.donationDate} >= ${fyStart}`);
        conditions.push(sql`${eChallans.donationDate} <= ${fyEnd}`);
      }

      // Filter by donation type (categoryCode)
      if (query?.donationType) {
        // First get the category ID from the code
        const catRows = await this.db
          .select()
          .from(donationCategories)
          .where(eq(donationCategories.categoryCode, query.donationType));

        if (catRows[0]) {
          conditions.push(eq(eChallans.categoryId, catRows[0].id));
        }
      }

      // Calculate pagination
      const page = query?.page || 1;
      const limit = query?.limit || 10;
      const offset = (page - 1) * limit;

      // Fetch donations with filters applied (all results for count)
      const allDonations = await this.db
        .select({
          id: eChallans.id,
          challanNumber: eChallans.challanNumber,
          amount: eChallans.amount,
          donationDate: eChallans.donationDate,
          paymentMode: eChallans.paymentMode,
          categoryId: eChallans.categoryId,
          categoryName: donationCategories.displayName,
          is80gEligible: donationCategories.is80gEligible,
        })
        .from(eChallans)
        .leftJoin(
          donationCategories,
          eq(eChallans.categoryId, donationCategories.id),
        )
        .where(and(...conditions))
        .orderBy(sql`${eChallans.donationDate} DESC`);

      const total = allDonations.length;

      // Apply pagination in memory
      const paginatedDonations = allDonations.slice(offset, offset + limit);

      // Format for frontend
      const data = paginatedDonations.map((d) => ({
        id: d.id,
        receiptNo: d.challanNumber,
        amount: parseFloat(d.amount as any) || 0,
        date: d.donationDate ? new Date(d.donationDate).toISOString().split('T')[0] : '',
        type: d.categoryName || 'General Fund',
        status: 'Success',
        eligible80G: d.is80gEligible ?? false,
      }));

      return { data, total };
    } catch (err) {
      console.error('Error fetching donations:', err);
      return { data: [], total: 0 };
    }
  }
  /**
   * Get aggregated donation summaries by Financial Year.
   * Used for 80G and Tax Document reports.
   */
  async getDonationSummaries(userId: number) {
    // Fetch all donations (high limit) to ensure accurate summary
    const { data: donations } = await this.findDonationsByUserId(userId, { limit: 100000 });
    console.log('donations', donations)
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
   * Get full donation history and summaries for PDF generation.
   */
  async getFullHistory(userId: number) {
    const { data: receipts } = await this.findDonationsByUserId(userId, { limit: 100000 });
    const taxDocs = await this.getDonationSummaries(userId);
    return { receipts, taxDocs };
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
      .from(donationCategories)
      .where(eq(donationCategories.categoryCode, dto.donationType));
    const categoryId = catRows[0]?.id || 1;

    // 3. Insert into e_challans using donorId (from donors table)
    // Generate Challan Number: AR + YYMMDD + Sequence (4 digits)
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const datePrefix = `AR${yy}${mm}${dd}`;

    // Find last challan for today to determine sequence
    const lastChallanRows = await this.db
      .select({ challanNumber: eChallans.challanNumber })
      .top(1)
      .from(eChallans)
      .where(like(eChallans.challanNumber, `${datePrefix}%`))
      .orderBy(desc(eChallans.id));

    let sequence = 1;
    if (lastChallanRows[0]?.challanNumber) {
      const lastSeqStr = lastChallanRows[0].challanNumber.replace(datePrefix, '');
      const lastSeq = parseInt(lastSeqStr, 10);
      if (!isNaN(lastSeq)) {
        sequence = lastSeq + 1;
      }
    }

    const challanNumber = `${datePrefix}${sequence.toString().padStart(4, '0')}`;

    await this.db.insert(eChallans).values({
      challanNumber,
      donorId: donorId,
      amount: dto.amount.toString(),
      categoryId,
      paymentMode: 'Online',
      donationDate: now,
      createdByUserId: userId,
    });

    // 4. Send Email Receipt
    const catName = catRows[0]?.displayName || 'General Fund';
    try {
      await this.emailService.sendDonationReceipt(normalizedEmail, dto.name, {
        amount: dto.amount,
        receiptNo: challanNumber,
        date: now.toISOString().split('T')[0],
        type: catName,
      });
    } catch (err) {
      console.error('Failed to send donation receipt email:', err);
    }

    // 5. Create Notification
    await this.notificationsService.create({
      userId,
      type: 'success',
      title: 'Donated',
      message: `Thank you for your donation of ₹${dto.amount}! Transaction recorded as ${challanNumber}.`,
    });

    return {
      success: true,
      receiptNo: challanNumber,
      amount: dto.amount,
      type: catName, // Returns display name (e.g. "General Fund")
      date: now.toISOString().split('T')[0],
      donationType: dto.donationType // Return original code too if needed
    };
  }

  /**
   * Create a guest donor (first-time "Donate without Signup").
   * Uses donors table when present (PAN); otherwise creates T_USER with User_Type = Standard User.
   */
  async createGuestOrReject(dto: CreateGuestDonorDto): Promise<{ donorId: number }> {
    // Normalize PAN if provided
    const normalizedPan = dto.pan ? dto.pan.trim().toUpperCase() : '';

    // Only check for existing PAN if PAN is provided
    if (normalizedPan) {
      const existingByPan = await this.findByPan(normalizedPan);
      if (existingByPan) {
        throw new ConflictException(
          'You have donated before with this PAN. Please use Login to Donate.',
        );
      }
    }

    // Check Mobile
    const mobile = dto.mobile.trim();
    const existingByMobile = await this.db
      .select()
      .top(1)
      .from(tUser)
      .where(eq(tUser.mobileNumber, mobile));

    if (existingByMobile[0]) {
      if (existingByMobile[0].isActive === false) {
        throw new ConflictException(
          'Your account is disabled. Please click Okay to enable your account.',
        );
      }
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
      if (existingByEmail[0].isActive === false) {
        throw new ConflictException(
          'Your account is disabled. Please click Okay to enable your account.',
        );
      }
      throw new ConflictException(
        'An account with this email already exists. Please use Login to Donate.',
      );
    }

    const now = new Date();
    // Create new user in T_USER
    // Generate password based on whether PAN is provided
    let tempPass: string;
    if (normalizedPan && normalizedPan.length > 0) {
      // If PAN is provided, use PAN-based password
      tempPass = `Aram@${normalizedPan}`;
    } else {
      // If no PAN, generate random strong password
      tempPass = generateStrongPassword();
    }

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
    const donationResult = await this.recordDonationInternal(inserted.id, email, {
      ...dto,
      pan: normalizedPan || '', // Use normalized PAN or empty string
    });

    return {
      donorId: inserted.id,
      ...donationResult
    };
  }
}

