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

  // Generation Rules
  @IsOptional()
  @IsBoolean()
  autoGenerateOnSuccess?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  generationDelay?: number;

  @IsOptional()
  @IsBoolean()
  autoGenerateImports?: boolean;

  @IsOptional()
  @IsBoolean()
  allowManualOffline?: boolean;

  @IsOptional()
  @IsBoolean()
  allowManualBulk?: boolean;

  @IsOptional()
  @IsBoolean()
  allowBackdated?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  backdateWindow?: number;

  @IsOptional()
  @IsBoolean()
  showBackdateStamp?: boolean;

  @IsOptional()
  @IsBoolean()
  requireReasonManual?: boolean;

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

  // Storage & Access
  @IsOptional()
  @IsString()
  @IsIn(['local', 's3'])
  storageMode?: string;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'token'])
  linkSecurity?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  linkExpiryDays?: number;

  @IsOptional()
  @IsBoolean()
  allowRegenerationTemplate?: boolean;

  @IsOptional()
  @IsBoolean()
  allowRegenerationAnytime?: boolean;

  // Bulk Operations
  @IsOptional()
  @IsBoolean()
  bulkGenerationAllowed?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10000)
  maxBatchSize?: number;

  @IsOptional()
  @IsString()
  zipFilenameFormat?: string;

  @IsOptional()
  @IsBoolean()
  includeIndexCsv?: boolean;

  @IsOptional()
  @IsBoolean()
  runInBackground?: boolean;

  // Status Workflow & Reprint/Reissue
  @IsOptional()
  @IsBoolean()
  allowMarkReissued?: boolean;

  @IsOptional()
  @IsBoolean()
  autoMarkDelivered?: boolean;

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
  @IsBoolean()
  requireReasonRegenerate?: boolean;

  @IsOptional()
  @IsBoolean()
  requireReasonCancel?: boolean;

  // Audit & Compliance
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  retentionYears?: number;

  // Search Defaults
  @IsOptional()
  @IsString()
  @IsIn(['today', 'this_week', 'this_month', 'this_quarter', 'this_year', 'all'])
  defaultDateFilter?: string;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(1000)
  defaultPageSize?: number;

  @IsOptional()
  @IsBoolean()
  exportFormatsCsv?: boolean;

  @IsOptional()
  @IsBoolean()
  exportFormatsExcel?: boolean;

  @IsOptional()
  @IsBoolean()
  exportFormatsPdf?: boolean;

  @IsOptional()
  @IsBoolean()
  maskPii?: boolean;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}
