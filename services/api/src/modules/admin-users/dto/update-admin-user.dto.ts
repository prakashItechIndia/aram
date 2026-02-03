import { IsString, IsEmail, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdminUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(15)
  @Matches(/^\+?[\d\s-]{10,15}$/, { message: 'Invalid mobile number' })
  mobileNumber?: string;

  @ApiPropertyOptional({ description: 'Role name' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  roleName?: string;
}
