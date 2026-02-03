import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private s3Service: S3Service,
  ) { }

  @Post('login')
  @ApiOperation({ summary: 'Login user (donor portal)' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user (donor portal)' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password - Send reset link (donor portal)' })
  async forgotPasswordDonor(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPasswordDonor(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token (donor portal)' })
  async resetPasswordDonor(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPasswordDonor(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Request() req) {
    const profile = await this.authService.getProfile(req.user.userId);
    if (!profile) {
      throw new UnauthorizedException('User profile not found');
    }
    return profile;
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password (logged in)' })
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, dto);
  }

  @Post('profile/image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload profile image' })
  async uploadProfileImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const key = `profiles/${req.user.userId}/${Date.now()}-${file.originalname}`;
    const url = await this.s3Service.upload(key, file.buffer, file.mimetype);
    return this.authService.updateProfileImage(req.user.userId, url);
  }

  // ——— Admin portal only (T_USER with User_Type Admin / Super Admin) ———

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin portal login' })
  async adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  @Post('admin/forgot-password')
  @ApiOperation({ summary: 'Admin forgot password' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('admin/reset-password')
  @ApiOperation({ summary: 'Admin reset password with token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin profile (Admin/Super Admin only)' })
  getAdminProfile(@Request() req) {
    return req.user;
  }
}
