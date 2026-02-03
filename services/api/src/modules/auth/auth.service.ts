import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../../database/database.module';
import { tUser } from '../../database/models/t-user.model';
import { and, eq, inArray } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { setResetToken, getAndConsumeResetToken } from './admin-reset-token.store';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { generateStrongPassword } from '../../common/utils/password.util';

const ADMIN_USER_TYPES = ['Admin', 'Super Admin'] as const;

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
  ) { }

  /** Validate against existing T_USER table (E_Mail, Password; supports bcrypt or legacy plain/base64). */
  async validateUser(email: string, pass: string): Promise<any> {
    if (!this.db) return null;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const trimmedPass = (pass || '').trim();
    if (!normalizedEmail) return null;

    const rows = await this.db
      .select()
      .top(1)
      .from(tUser)
      .where(and(eq(tUser.eMail, normalizedEmail), eq(tUser.isActive, true)));
    const user = rows[0];
    if (!user) return null;

    // Check match against bcrypt, plain text, or base64 (legacy)
    const match =
      (user.password?.startsWith('$2') && (await bcrypt.compare(pass, user.password))) ||
      pass === user.password ||
      (user.password && Buffer.from(user.password, 'base64').toString('utf8') === pass);
    if (!match) return null;
    const { password, ...result } = user;
    return { id: result.id, email: result.eMail, name: result.name, userType: result.userType };
  }
  async getProfile(userId: number) {
    if (!this.db) return null;
    const rows = await this.db.select().from(tUser).where(eq(tUser.id, userId));
    const user = rows[0];
    if (!user) return null;
    const { password, ...result } = user;
    return {
      ...result,
      userId: result.id,
      email: result.eMail, // Normalize for frontend
      mobileNumber: result.mobileNumber,
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
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /** Register inserts into T_USER (existing table). Password stored as bcrypt. */
  async register(registerDto: RegisterDto) {
    if (!this.db) throw new Error('Database not initialized');
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    await this.db.insert(tUser).values({
      name: registerDto.name,
      userType: 'Standard User',
      userName: registerDto.email?.replace(/@.*/, '') || registerDto.name,
      password: hashedPassword,
      eMail: registerDto.email,
      isActive: true,
      createdBy: 1,
      createdDate: new Date(),
    });
    const rows = await this.db.select().top(1).from(tUser).where(eq(tUser.eMail, registerDto.email));
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

    console.log('User found:', user.id);

    // Generate Token
    const token = randomBytes(32).toString('hex');
    setResetToken(token, normalizedEmail);

    const baseUrl = this.configService.get<string>('DONOR_APP_URL') || 'http://localhost:5173'; // Default to donor app port
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // Send Email
    console.log('Sending email...');
    try {
      await this.emailService.sendResetLink(normalizedEmail, user.name || 'User', resetLink);
      console.log('Reset link sent successfully');
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
