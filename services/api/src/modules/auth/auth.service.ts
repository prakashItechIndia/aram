import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { and, desc, eq, inArray, or } from 'drizzle-orm';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import { generateStrongPassword } from '../../common/utils/password.util';
import { DRIZZLE } from '../../database/database.module';
import { donationCategories } from '../../database/models/donation-categories.model';
import { donors } from '../../database/models/donors.model';
import { eChallans } from '../../database/models/e-challans.model';
import { tUser } from '../../database/models/t-user.model';
import * as schema from '../../database/schema';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
// import { donors } from '../../database/models/donors.model';
import { SmsService } from '../sms/sms.service';
import { getAndConsumeResetToken, setResetToken } from './admin-reset-token.store';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { userOtp } from '../../database/models/user-otp.model';

const ADMIN_USER_TYPES = ['Admin', 'Super Admin'] as const;

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
    private smsService: SmsService,
  ) { }

  /** Validate against existing T_USER (Email or Mobile, Password). Checks existence first. */
  async validateUser(identifier: string, pass: string): Promise<any> {
    if (!this.db) return null;
    const normalizedInput = (identifier || '').trim().toLowerCase();
    const trimmedPass = (pass || '').trim();
    if (!normalizedInput) return null;

    const rows = await this.db
      .select()
      .top(1)
      .from(tUser)
      .where(
        and(
          or(eq(tUser.eMail, normalizedInput), eq(tUser.mobileNumber, normalizedInput)),
          eq(tUser.isActive, true) // Ensure active
        )
      );

    const user = rows[0];
    if (!user) {
      throw new NotFoundException('User not Registered');
    }

    // Check match against bcrypt, plain text, or base64 (legacy)
    const match =
      (user.password?.startsWith('$2') && (await bcrypt.compare(pass, user.password))) ||
      (pass === user.password) ||
      (user.password && Buffer.from(user.password, 'base64').toString('utf8') === pass);

    if (!match) return null; // Let login() handle invalid password

    const { password: _, ...result } = user;
    return { id: result.id, email: result.eMail, name: result.name, userType: result.userType };
  }

  async checkMobile(mobileNumber: string) {
    if (!this.db) throw new Error('Database not initialized');
    const rows = await this.db
      .select()
      .from(tUser)
      .where(and(eq(tUser.mobileNumber, mobileNumber.trim()), eq(tUser.isActive, true)));

    return { registered: rows.length > 0 };
  }

  async sendOtp(mobileNumber: string) {
    if (!this.db) throw new Error('Database not initialized');

    // 1. Check if user exists
    const users = await this.db
      .select()
      .from(tUser)
      .where(and(eq(tUser.mobileNumber, mobileNumber.trim()), eq(tUser.isActive, true)));

    const user = users[0];
    if (!user) {
      throw new NotFoundException('Mobile number is not registered');
    }

    // 2. Generate OTP
    const code = this.smsService.generateOtpCode(6);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    // 3. Store in DB
    console.log(`[AuthService] Inserting OTP into DB for mobile: ${mobileNumber.trim()}, userId: ${user.id}`);
    try {
      await this.db.insert(userOtp).values({
        userId: user.id,
        phone: mobileNumber.trim(),
        otpCode: code,
        expiresAt: expiresAt.toISOString(),
      } as any);
      console.log(`[AuthService] Successfully inserted OTP into DB`);
    } catch (dbErr) {
      console.error(`[AuthService] Database insertion FAILED:`, dbErr);
      throw dbErr;
    }

    // 4. Send SMS
    await this.smsService.sendOtpCode(mobileNumber.trim(), code);

    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOtp(mobileNumber: string, otpCode: string) {
    if (!this.db) throw new Error('Database not initialized');

    // 1. Find latest unverified OTP for this phone
    const otps = await this.db
      .select()
      .top(1)
      .from(userOtp)
      .where(
        and(
          eq(userOtp.phone, mobileNumber.trim()),
          eq(userOtp.otpCode, otpCode.trim()),
        )
      )
      .orderBy(desc(userOtp.createdAt));

    const otp = otps[0];
    if (!otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // 2. Check Expiry
    if (new Date() > new Date(otp.expiresAt)) {
      throw new BadRequestException('OTP has expired');
    }

    // 3. Get User and return token
    const users = await this.db
      .select()
      .top(1)
      .from(tUser)
      .where(eq(tUser.id, otp.userId!));

    const user = users[0];
    if (!user) throw new NotFoundException('User not found');

    const payload = { email: user.eMail, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.eMail,
        phone: user.mobileNumber,
      }
    };
  }

  async getProfile(userId: number) {
    if (!this.db) return null;
    const rows = await this.db.select().from(tUser).where(eq(tUser.id, userId));
    const user = rows[0];
    if (!user) return null;

    let donationAmount = null;
    let donationType = null;
    let pan = null;
    let address = user.location;

    // Fetch donor profile to get PAN and Address
    if (user.eMail) {
      try {
        const donorRows = await this.db
          .select()
          .from(donors)
          .where(eq(donors.email, user.eMail.trim().toLowerCase()));

        const donor = donorRows[0];
        if (donor) {
          pan = donor.pan;
          address = donor.address || address;

          const lastDonation = await this.db
            .select({
              amount: eChallans.amount,
              typeCode: donationCategories.categoryCode,
            })
            .top(1)
            .from(eChallans)
            .leftJoin(
              donationCategories,
              eq(eChallans.categoryId, donationCategories.id),
            )
            .where(eq(eChallans.donorId, donor.id))
            .orderBy(desc(eChallans.id));

          const last = lastDonation[0];
          if (last) {
            donationAmount = last.amount;
            donationType = last.typeCode;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch donor details in getProfile:', err);
      }
    }

    const { password, ...result } = user;
    return {
      ...result,
      userId: result.id,
      email: result.eMail,
      mobileNumber: result.mobileNumber,
      location: address,
      pan,
      donationAmount,
      donationType,
    };
  }

  async findUserById(id: number) {
    if (!this.db) return null;
    const rows = await this.db.select().top(1).from(tUser).where(eq(tUser.id, id));
    const user = rows[0];
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /** Register inserts into T_USER (existing table). Password stored as bcrypt. */
  async register(registerDto: RegisterDto) {
    if (!this.db) throw new Error('Database not initialized');

    const normalizedEmail = (registerDto.email || '').trim().toLowerCase();
    const phone = (registerDto.phone || '').trim();

    // 1. Check if email already exists
    const existingEmail = await this.db
      .select()
      .from(tUser)
      .where(eq(tUser.eMail, normalizedEmail));

    if (existingEmail.length > 0) {
      throw new BadRequestException('Email already exists');
    }

    // 2. Check if phone number already exists
    const existingPhone = await this.db
      .select()
      .from(tUser)
      .where(eq(tUser.mobileNumber, phone));

    if (existingPhone.length > 0) {
      throw new BadRequestException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    await this.db.insert(tUser).values({
      name: registerDto.name,
      userType: 'Standard User',
      userName: normalizedEmail.replace(/@.*/, '') || registerDto.name,
      password: hashedPassword,
      eMail: normalizedEmail,
      mobileNumber: phone,
      isActive: true,
      createdBy: 1,
      createdDate: new Date(),
    });

    const rows = await this.db.select().top(1).from(tUser).where(eq(tUser.eMail, normalizedEmail));
    const user = rows[0];
    return user ? { id: user.id, name: user.name, eMail: user.eMail } : null;
  }

  async forgotPasswordDonor(dto: ForgotPasswordDto) {
    console.log('forgotPasswordDonor called with:', dto);
    const normalizedEmail = (dto.email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      throw new BadRequestException('Valid email is required');
    }

    const rows = await this.db.select().top(1).from(tUser).where(and(eq(tUser.eMail, normalizedEmail), eq(tUser.isActive, true)));
    const user = rows[0];

    if (!user) {
      console.log('User not found for email:', normalizedEmail);
      throw new NotFoundException('Account with this email does not exist.');
    }

    // Generate Token
    const token = randomBytes(32).toString('hex');
    setResetToken(token, normalizedEmail);

    const baseUrl = this.configService.get<string>('DONOR_APP_URL') || 'http://localhost:5173'; // Default to donor app port
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // Send Email
    try {
      await this.emailService.sendResetLink(normalizedEmail, user.name || 'User', resetLink);
    } catch (e) {
      console.error('Error sending email:', e);
    }

    // Return link in dev mode for convenience
    return {
      message: 'If this email is registered, you will receive a reset link.',
      resetLink: this.configService.get<string>('NODE_ENV') === 'development' ? resetLink : undefined
    };
  }

  async resetPasswordDonor(dto: ResetPasswordDto) {
    const record = getAndConsumeResetToken(dto.token);
    if (!record) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    // Use bcrypt for secure hashing (now supported by column length 255)
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.db
      .update(tUser)
      .set({ password: hashedPassword })
      .where(eq(tUser.eMail, record.email));

    // Create persistent notification
    const userRows = await this.db.select().from(tUser).where(eq(tUser.eMail, record.email));
    if (userRows[0]) {
      await this.notificationsService.create({
        userId: userRows[0].id,
        type: 'info',
        title: 'Password Reset',
        message: 'Your password was successfully reset.',
      });
    }

    return { message: 'Password has been reset. You can sign in with your new password.' };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const rows = await this.db.select().top(1).from(tUser).where(eq(tUser.id, userId));
    const user = rows[0];
    if (!user) throw new NotFoundException('User not found');

    // Verify current password
    const match =
      (user.password?.startsWith('$2') && (await bcrypt.compare(dto.currentPassword, user.password))) ||
      user.password === dto.currentPassword ||
      (user.password && Buffer.from(user.password, 'base64').toString('utf8') === dto.currentPassword);

    if (!match) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password cannot be the same as the current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.db
      .update(tUser)
      .set({ password: hashedPassword })
      .where(eq(tUser.id, userId));

    return { message: 'Password updated successfully' };
  }

  async updateProfileImage(userId: number, url: string) {
    await this.db
      .update(tUser)
      .set({ profilePicture: url })
      .where(eq(tUser.id, userId));
    return { url };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const updateData: any = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.mobileNumber) updateData.mobileNumber = dto.mobileNumber;
    if (dto.address) updateData.location = dto.address;

    if (Object.keys(updateData).length > 0) {
      await this.db
        .update(tUser)
        .set(updateData)
        .where(eq(tUser.id, userId));
    }

    // Also update donors table if exists
    const user = await this.findUserById(userId);
    if (user?.eMail) {
      const email = user.eMail.trim().toLowerCase();
      const donorUpdate: any = {};
      if (dto.name) donorUpdate.name = dto.name;
      if (dto.mobileNumber) donorUpdate.mobile = dto.mobileNumber;
      if (dto.address) donorUpdate.address = dto.address;
      if (dto.pan) donorUpdate.pan = dto.pan;

      if (Object.keys(donorUpdate).length > 0) {
        donorUpdate.updatedAt = new Date();
        await this.db
          .update(donors)
          .set(donorUpdate)
          .where(eq(donors.email, email));
      }
    }

    return { message: 'Profile updated successfully' };
  }

  private generateTemporaryPassword(length = 10): string {
    return generateStrongPassword(length);
  }

  // ——— Admin-only (T_USER with User_Type Admin / Super Admin) ———

  /** Validate admin user: T_USER with E_Mail, active, and User_Type in (Admin, Super Admin). */
  async validateAdminUser(email: string, pass: string): Promise<any> {
    if (!this.db) return null;
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) return null;
    const rows = await this.db
      .select()
      .top(1)
      .from(tUser)
      .where(
        and(
          eq(tUser.eMail, normalizedEmail),
          eq(tUser.isActive, true),
          inArray(tUser.userType, [...ADMIN_USER_TYPES]),
        ),
      );
    const user = rows[0];
    if (!user) return null;
    const match =
      (user.password?.startsWith('$2') && (await bcrypt.compare(pass, user.password))) ||
      user.password === pass ||
      (user.password && Buffer.from(user.password, 'base64').toString('utf8') === pass);
    if (!match) return null;
    const { password, ...result } = user;
    return { id: result.id, email: result.eMail, name: result.name, userType: result.userType };
  }

  async adminLogin(dto: AdminLoginDto) {
    const user = await this.validateAdminUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { email: user.email, sub: user.id, userType: user.userType };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const normalizedEmail = (dto.email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      throw new BadRequestException('Valid email is required');
    }
    const rows = await this.db
      .select()
      .top(1)
      .from(tUser)
      .where(
        and(
          eq(tUser.eMail, normalizedEmail),
          eq(tUser.isActive, true),
          inArray(tUser.userType, [...ADMIN_USER_TYPES]),
        ),
      );
    const user = rows[0];
    if (!user) {
      throw new NotFoundException('Account with this email does not exist.');
    }
    const token = randomBytes(32).toString('hex');
    setResetToken(token, normalizedEmail);
    const baseUrl = this.configService.get<string>('ADMIN_APP_URL') || 'http://localhost:5173';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;
    await this.emailService.sendResetLink(normalizedEmail, user.name || 'Admin', resetLink);
    return {
      message: 'If this email is registered as an admin, you will receive a reset link.',
      resetLink: this.configService.get<string>('NODE_ENV') === 'development' ? resetLink : undefined,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = getAndConsumeResetToken(dto.token);
    if (!record) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.db
      .update(tUser)
      .set({ password: hashedPassword })
      .where(eq(tUser.eMail, record.email));
    return { message: 'Password has been reset. You can sign in with your new password.' };
  }
}
