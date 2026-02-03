import { IsOptional, IsBoolean, IsString, IsArray, IsNumber, IsIn, Min, Max } from 'class-validator';

export class UpdateDonationFormSettingsDto {
  // Form Status
  @IsOptional()
  @IsBoolean()
  formEnabled?: boolean;

  @IsOptional()
  @IsString()
  maintenanceMessage?: string;

  // Field Configuration
  @IsOptional()
  @IsBoolean()
  multiCountry?: boolean;

  @IsOptional()
  @IsIn(['always', 'threshold', 'optional', 'never'])
  panRequired?: 'always' | 'threshold' | 'optional' | 'never';

  @IsOptional()
  @IsNumber()
  @Min(0)
  panThreshold?: number;

  @IsOptional()
  @IsBoolean()
  addressRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  mobileRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  otpVerification?: boolean;

  // Amount Configuration
  @IsOptional()
  @IsArray()
  presetAmounts?: number[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAmount?: number;

  @IsOptional()
  @IsBoolean()
  allowCustomAmount?: boolean;

  // Recurring Donations
  @IsOptional()
  @IsBoolean()
  enableRecurring?: boolean;

  @IsOptional()
  @IsBoolean()
  suggestRecurring?: boolean;

  @IsOptional()
  @IsArray()
  recurringFrequencies?: string[];

  // Payment Options
  @IsOptional()
  @IsArray()
  enabledPaymentModes?: string[];

  @IsOptional()
  @IsString()
  defaultPaymentMode?: string;

  // Form Behavior
  @IsOptional()
  @IsBoolean()
  showDonorHistory?: boolean;

  @IsOptional()
  @IsBoolean()
  autoFillLastDonor?: boolean;

  @IsOptional()
  @IsBoolean()
  requireTermsAcceptance?: boolean;

  @IsOptional()
  @IsString()
  termsAndConditionsUrl?: string;

  @IsOptional()
  @IsBoolean()
  enable80GCertificate?: boolean;

  @IsOptional()
  @IsBoolean()
  showProgressBar?: boolean;

  // Metadata
  @IsOptional()
  @IsString()
  changesDescription?: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}
