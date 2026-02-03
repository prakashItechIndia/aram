import { IsString, IsEmail, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'john@aram.org' })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  @Matches(/^\+?[\d\s-]{10,15}$/, { message: 'Invalid mobile number' })
  mobileNumber?: string;

  @ApiProperty({ example: 'Admin', description: 'Role name (e.g. Super Admin, Admin, Finance Manager, Operator)' })
  @IsString()
  @MaxLength(64)
  roleName: string;
}
