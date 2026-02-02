import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE } from '../../database/database.module';
import { tUser } from '../../database/schema';
import { and, eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>,
    private jwtService: JwtService,
  ) {}

  /** Validate against existing T_USER table (E_Mail, Password; supports bcrypt or legacy plain/base64). */
  async validateUser(email: string, pass: string): Promise<any> {
    if (!this.db) return null;
    const rows = await this.db
      .select()
      .top(1)
      .from(tUser)
      .where(and(eq(tUser.eMail, email), eq(tUser.isActive, true)));
    const user = rows[0];
    if (!user) return null;
    const match =
      (user.password?.startsWith('$2') && (await bcrypt.compare(pass, user.password))) ||
      pass === user.password;
    if (!match) return null;
    const { password, ...result } = user;
    return { id: result.id, email: result.eMail, name: result.name, userType: result.userType };
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
}
