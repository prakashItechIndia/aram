import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { tUser } from '../../database/models/t-user.model';
import { userRoles } from '../../database/models/user-roles.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { generateStrongPassword } from '../../common/utils/password.util';
import type { CreateAdminUserDto } from './dto/create-admin-user.dto';
import type { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    @Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>,
    private emailService: EmailService,
  ) {}

  async findAll() {
    const rows = await this.db.select().from(tUser).orderBy(tUser.id);
    const roles = await this.db.select().from(userRoles);
    const roleNames = new Set(roles.map((r) => r.name));
    const list = rows
      .filter((u) => u.userType && roleNames.has(u.userType))
      .map((u) => ({
        id: u.id,
        name: u.name ?? '',
        email: u.eMail ?? '',
        mobileNumber: u.mobileNumber ?? '',
        roleName: u.userType ?? '',
        isActive: u.isActive ?? true,
        createdDate: u.createdDate,
      }));
    return list;
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(tUser).where(eq(tUser.id, id));
    const user = rows[0];
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return {
      id: user.id,
      name: user.name ?? '',
      email: user.eMail ?? '',
      mobileNumber: user.mobileNumber ?? '',
      roleName: user.userType ?? '',
      isActive: user.isActive ?? true,
      createdDate: user.createdDate,
    };
  }

  async create(dto: CreateAdminUserDto) {
    const email = (dto.email || '').trim().toLowerCase();
    if (!email) throw new BadRequestException('Email is required');
    const name = (dto.name || '').trim() || email.split('@')[0];
    const roleName = (dto.roleName || '').trim();
    if (!roleName) throw new BadRequestException('Role is required');

    const existing = await this.db.select().top(1).from(tUser).where(eq(tUser.eMail, email));
    if (existing.length > 0) throw new BadRequestException(`A user with email "${email}" already exists`);

    const roleRows = await this.db.select().top(1).from(userRoles).where(eq(userRoles.name, roleName));
    if (roleRows.length === 0) throw new BadRequestException(`Role "${roleName}" not found`);

    const tempPassword = generateStrongPassword(12);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await this.db.insert(tUser).values({
      name,
      eMail: email,
      mobileNumber: dto.mobileNumber?.trim() ?? null,
      userType: roleName,
      userName: email.split('@')[0] ?? name,
      password: hashedPassword,
      isActive: true,
      createdBy: null,
      createdDate: new Date(),
    });

    try {
      await this.emailService.sendAdminInvite(email, name, tempPassword);
    } catch (err) {
      // User created; log email failure but don't fail the request
      console.error('Failed to send admin invite email:', err);
    }

    const rows = await this.db.select().from(tUser).where(eq(tUser.eMail, email));
    const inserted = rows[0];
    if (!inserted) throw new NotFoundException('User not found after create');
    return this.findById(inserted.id);
  }

  async update(id: number, dto: UpdateAdminUserDto) {
    const user = await this.findById(id);
    const email = dto.email?.trim().toLowerCase();
    if (email && email !== user.email) {
      const existing = await this.db.select().top(1).from(tUser).where(eq(tUser.eMail, email));
      if (existing.length > 0 && existing[0].id !== id) {
        throw new BadRequestException(`A user with email "${email}" already exists`);
      }
    }
    if (dto.roleName?.trim()) {
      const roleRows = await this.db.select().top(1).from(userRoles).where(eq(userRoles.name, dto.roleName.trim()));
      if (roleRows.length === 0) throw new BadRequestException(`Role "${dto.roleName}" not found`);
    }

    const updates: Record<string, unknown> = {};
    if (dto.name !== undefined) updates.name = dto.name.trim();
    if (dto.email !== undefined) updates.eMail = dto.email.trim().toLowerCase();
    if (dto.mobileNumber !== undefined) updates.mobileNumber = dto.mobileNumber?.trim() ?? null;
    if (dto.roleName !== undefined) updates.userType = dto.roleName.trim();
    if (dto.email !== undefined) updates.userName = dto.email.trim().toLowerCase().split('@')[0];

    if (Object.keys(updates).length > 0) {
      await this.db.update(tUser).set(updates as any).where(eq(tUser.id, id));
    }
    return this.findById(id);
  }

  async delete(id: number) {
    await this.findById(id);
    await this.db.delete(tUser).where(eq(tUser.id, id));
    return { success: true };
  }
}
