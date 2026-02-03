import { IsString, IsEmail, IsOptional, MaxLength, Matches, IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\+?[\d\s-]{10,15}$/;

export class CreateAdminUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'User name is required' })
  @IsString()
  @MaxLength(100, { message: 'User name must be at most 100 characters' })
  name: string;

  @ApiProperty({ example: 'john@aram.org' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @MaxLength(100, { message: 'Email must be at most 100 characters' })
  email: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(15, { message: 'Mobile number must be at most 15 characters' })
  @Matches(MOBILE_REGEX, { message: 'Please enter a valid mobile number (10–15 digits, optional +)' })
  mobileNumber?: string;

  @ApiProperty({ example: 'Admin', description: 'Role name (e.g. Super Admin, Admin, Finance Manager, Operator)' })
  @IsNotEmpty({ message: 'Role is required' })
  @IsString()
  @MaxLength(64, { message: 'Role name must be at most 64 characters' })
  roleName: string;

  @ApiPropertyOptional({ description: 'Profile image URL (from S3 upload)' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  @IsUrl({}, { message: 'Profile image URL must be a valid URL' })
  profileImageUrl?: string;
}
