import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class FeatureConfigItemDto {
  @ApiProperty({ example: 'donation_form_enabled' })
  key!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  value?: string | null;

  @ApiProperty({ example: true })
  isEnabled!: boolean;
}

export class DonationFormConfigDto {
  @ApiPropertyOptional({ description: 'Form publicly accessible when true' })
  donationFormEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Shown when form is disabled' })
  maintenanceMessage?: string;

  @ApiPropertyOptional({ description: 'Test mode – no real transactions' })
  testMode?: boolean;

  @ApiPropertyOptional({ description: 'Country dropdown vs default India' })
  multiCountrySupport?: boolean;

  @ApiPropertyOptional({ description: 'always | threshold | optional_international' })
  panRequirement?: string;

  @ApiPropertyOptional()
  panThresholdAmount?: number;

  @ApiPropertyOptional()
  requireAddress?: boolean;

  @ApiPropertyOptional()
  requireMobile?: boolean;

  @ApiPropertyOptional()
  mobileOtpVerification?: boolean;

  @ApiPropertyOptional({ type: [Number], example: [500, 1000, 2500, 5000] })
  presetAmounts?: number[];

  @ApiPropertyOptional()
  minAmount?: number;

  @ApiPropertyOptional()
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'Show recurring donation option' })
  suggestRecurring?: boolean;

  @ApiPropertyOptional()
  sendReceiptEmail?: boolean;

  @ApiPropertyOptional()
  sendReceiptSms?: boolean;

  @ApiPropertyOptional()
  send80GEmail?: boolean;
}

export class GetFeatureConfigResponseDto {
  @ApiProperty({ type: [FeatureConfigItemDto] })
  items!: FeatureConfigItemDto[];

  @ApiProperty({ type: DonationFormConfigDto })
  donationForm!: DonationFormConfigDto;
}
