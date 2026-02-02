import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGuestDonorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Mobile must be 10 digits' })
  mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'PAN in format AAAAA0000A' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/, { message: 'Invalid PAN format (e.g. AAAAA0000A)' })
  pan: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty()
  @IsNumber()
  @Min(100)
  @Max(50000)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  donationType: string;
}
