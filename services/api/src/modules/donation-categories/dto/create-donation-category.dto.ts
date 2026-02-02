import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDonationCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  typeCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visibleOnForm?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  tagLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  highlighted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  // Amount rules
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  presetAmounts?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowCustomAmount?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  recurringAllowed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  recurringDefaultChecked?: boolean;

  // Receipt & 80G
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  receiptEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  eligible80G?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  template80G?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  templateNon80G?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoEmailReceipt?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoSMSReceipt?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiptDescription?: string;

  // Form field rules
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  panRule?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  panThreshold?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  addressRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  mobileRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showPurposeField?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowAnonymous?: boolean;

  // Gateway restrictions
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  allowedGateways?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  allowedPaymentMethods?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  internationalAllowed?: boolean;

  // Accounting
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  accountingHead?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  costCenter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  taxCategory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  reportGrouping?: string;
}
