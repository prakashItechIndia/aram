import { IsString, IsEmail, IsOptional, MaxLength, Matches, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const MOBILE_REGEX = /^\+?[\d\s-]{10,15}$/;

export class UpdateAdminUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'User name must be at most 100 characters' })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @MaxLength(100, { message: 'Email must be at most 100 characters' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(15, { message: 'Mobile number must be at most 15 characters' })
  @Matches(MOBILE_REGEX, { message: 'Please enter a valid mobile number (10–15 digits, optional +)' })
  mobileNumber?: string;

  @ApiPropertyOptional({ description: 'Role name' })
  @IsOptional()
  @IsString()
  @MaxLength(64, { message: 'Role name must be at most 64 characters' })
  roleName?: string;

  @ApiPropertyOptional({ description: 'Profile image URL (from S3 upload)' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  @IsUrl({}, { message: 'Profile image URL must be a valid URL' })
  profileImageUrl?: string;
}
