import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
  Max,
  IsIn,
  IsArray,
} from 'class-validator';

export class UpdateReceiptSettingsDto {
  // Numbering & Series
  @IsOptional()
  @IsString()
  receiptPrefix?: string;

  @IsOptional()
  @IsString()
  startingNumber?: string;


  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  paddingLength?: number;

  @IsOptional()
  @IsBoolean()
  noGapEnforcement?: boolean;

  @IsOptional()
  @IsBoolean()
  autoCreateNewSeries?: boolean;

  @IsOptional()
  @IsBoolean()
  manualApprovalRequired?: boolean;

  @IsOptional()
  @IsArray()
  receiptTypes?: Array<{
    id: string;
    label: string;
    enabled: boolean;
    isDefault: boolean;
  }>;

  // Generation Rules removed


  // Template Rules
  @IsOptional()
  @IsString()
  defaultTemplateOnline?: string;

  @IsOptional()
  @IsString()
  defaultTemplateOffline?: string;

  @IsOptional()
  @IsString()
  template80g?: string;

  @IsOptional()
  @IsString()
  templateNon80g?: string;

  @IsOptional()
  @IsBoolean()
  forceRegenerateOnUpdate?: boolean;

  @IsOptional()
  @IsBoolean()
  lockContentAfterGeneration?: boolean;

  // Mandatory Fields
  @IsOptional()
  @IsBoolean()
  mobileRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  emailRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  addressRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  donationCategoryRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  donationTypeRequired?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['always', 'threshold', 'optional'])
  panRule?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  panThreshold?: number;

  @IsOptional()
  @IsBoolean()
  panAutoUppercase?: boolean;

  @IsOptional()
  @IsBoolean()
  pincodeValidation?: boolean;

  @IsOptional()
  @IsBoolean()
  duplicateWarning?: boolean;

  // Delivery Settings
  @IsOptional()
  @IsBoolean()
  autoSendEmailOnReceiptGeneration?: boolean;

  @IsOptional()
  @IsString()
  emailSubjectFormat?: string;

  @IsOptional()
  @IsString()
  emailSenderName?: string;

  @IsOptional()
  @IsString()
  emailReplyTo?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  emailRetryAttempts?: number;

  @IsOptional()
  @IsBoolean()
  emailFailureAlertsNotifyAdmin?: boolean;

  @IsOptional()
  @IsBoolean()
  autoSendSmsOnReceiptGeneration?: boolean;

  @IsOptional()
  @IsString()
  smsTemplate?: string;

  @IsOptional()
  @IsBoolean()
  smsShortLink?: boolean;

  // Reprint & Reissue
  @IsOptional()
  @IsBoolean()
  allowReprint?: boolean;

  @IsOptional()
  @IsBoolean()
  allowResendEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  allowCorrection?: boolean;

  @IsOptional()
  @IsBoolean()
  requireReasonReprint?: boolean;

  @IsOptional()
  @IsBoolean()
  requireReasonCorrection?: boolean;

  @IsOptional()
  @IsBoolean()
  requireReasonManualGen?: boolean;


  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsOptional()
  @IsString()
  reasonForChange?: string;
}
