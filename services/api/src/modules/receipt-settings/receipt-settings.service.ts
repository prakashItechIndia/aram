import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module';
import { receiptSettings } from '../../database/models/receipt-settings.model';
import { eq } from 'drizzle-orm';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { UpdateReceiptSettingsDto } from './dto/update-receipt-settings.dto';

@Injectable()
export class ReceiptSettingsService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findSettings() {
    const rows = await this.db.select().top(1).from(receiptSettings);
    
    if (rows.length === 0) {
      // Return default settings if none exist
      return this.getDefaultSettings();
    }

    const row = rows[0];
    return this.parseSettings(row);
  }

  async updateSettings(dto: UpdateReceiptSettingsDto) {
    const existing = await this.db.select().top(1).from(receiptSettings);

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
      updatedBy: dto.updatedBy || 'System',
    };

    // Numbering & Series
    if (dto.receiptPrefix !== undefined) updates.receiptPrefix = dto.receiptPrefix;
    if (dto.startingNumber !== undefined) updates.startingNumber = dto.startingNumber;
    if (dto.paddingLength !== undefined) updates.paddingLength = dto.paddingLength;
    if (dto.noGapEnforcement !== undefined) updates.noGapEnforcement = dto.noGapEnforcement;
    if (dto.autoCreateNewSeries !== undefined) updates.autoCreateNewSeries = dto.autoCreateNewSeries;
    if (dto.manualApprovalRequired !== undefined) updates.manualApprovalRequired = dto.manualApprovalRequired;
    if (dto.receiptTypes !== undefined) updates.receiptTypesJson = JSON.stringify(dto.receiptTypes);

    // Generation Rules
    if (dto.autoGenerateOnSuccess !== undefined) updates.autoGenerateOnSuccess = dto.autoGenerateOnSuccess;
    if (dto.generationDelay !== undefined) updates.generationDelay = dto.generationDelay;
    if (dto.autoGenerateImports !== undefined) updates.autoGenerateImports = dto.autoGenerateImports;
    if (dto.allowManualOffline !== undefined) updates.allowManualOffline = dto.allowManualOffline;
    if (dto.allowManualBulk !== undefined) updates.allowManualBulk = dto.allowManualBulk;
    if (dto.allowBackdated !== undefined) updates.allowBackdated = dto.allowBackdated;
    if (dto.backdateWindow !== undefined) updates.backdateWindow = dto.backdateWindow;
    if (dto.showBackdateStamp !== undefined) updates.showBackdateStamp = dto.showBackdateStamp;
    if (dto.requireReasonManual !== undefined) updates.requireReasonManual = dto.requireReasonManual;

    // Template Rules
    if (dto.defaultTemplateOnline !== undefined) updates.defaultTemplateOnline = dto.defaultTemplateOnline;
    if (dto.defaultTemplateOffline !== undefined) updates.defaultTemplateOffline = dto.defaultTemplateOffline;
    if (dto.template80g !== undefined) updates.template80g = dto.template80g;
    if (dto.templateNon80g !== undefined) updates.templateNon80g = dto.templateNon80g;
    if (dto.forceRegenerateOnUpdate !== undefined) updates.forceRegenerateOnUpdate = dto.forceRegenerateOnUpdate;
    if (dto.lockContentAfterGeneration !== undefined) updates.lockContentAfterGeneration = dto.lockContentAfterGeneration;

    // Mandatory Fields
    if (dto.mobileRequired !== undefined) updates.mobileRequired = dto.mobileRequired;
    if (dto.emailRequired !== undefined) updates.emailRequired = dto.emailRequired;
    if (dto.addressRequired !== undefined) updates.addressRequired = dto.addressRequired;
    if (dto.donationCategoryRequired !== undefined) updates.donationCategoryRequired = dto.donationCategoryRequired;
    if (dto.donationTypeRequired !== undefined) updates.donationTypeRequired = dto.donationTypeRequired;
    if (dto.panRule !== undefined) updates.panRule = dto.panRule;
    if (dto.panThreshold !== undefined) updates.panThreshold = dto.panThreshold;
    if (dto.panAutoUppercase !== undefined) updates.panAutoUppercase = dto.panAutoUppercase;
    if (dto.pincodeValidation !== undefined) updates.pincodeValidation = dto.pincodeValidation;
    if (dto.duplicateWarning !== undefined) updates.duplicateWarning = dto.duplicateWarning;

    // Delivery Settings
    if (dto.autoSendEmailOnReceiptGeneration !== undefined) updates.autoSendEmailOnReceiptGeneration = dto.autoSendEmailOnReceiptGeneration;
    if (dto.emailSubjectFormat !== undefined) updates.emailSubjectFormat = dto.emailSubjectFormat;
    if (dto.emailSenderName !== undefined) updates.emailSenderName = dto.emailSenderName;
    if (dto.emailReplyTo !== undefined) updates.emailReplyTo = dto.emailReplyTo;
    if (dto.emailRetryAttempts !== undefined) updates.emailRetryAttempts = dto.emailRetryAttempts;
    if (dto.emailFailureAlertsNotifyAdmin !== undefined) updates.emailFailureAlertsNotifyAdmin = dto.emailFailureAlertsNotifyAdmin;
    if (dto.autoSendSmsOnReceiptGeneration !== undefined) updates.autoSendSmsOnReceiptGeneration = dto.autoSendSmsOnReceiptGeneration;
    if (dto.smsTemplate !== undefined) updates.smsTemplate = dto.smsTemplate;
    if (dto.smsShortLink !== undefined) updates.smsShortLink = dto.smsShortLink;

    // Storage & Access
    if (dto.storageMode !== undefined) updates.storageMode = dto.storageMode;
    if (dto.linkSecurity !== undefined) updates.linkSecurity = dto.linkSecurity;
    if (dto.linkExpiryDays !== undefined) updates.linkExpiryDays = dto.linkExpiryDays;
    if (dto.allowRegenerationTemplate !== undefined) updates.allowRegenerationTemplate = dto.allowRegenerationTemplate;
    if (dto.allowRegenerationAnytime !== undefined) updates.allowRegenerationAnytime = dto.allowRegenerationAnytime;

    // Bulk Operations
    if (dto.bulkGenerationAllowed !== undefined) updates.bulkGenerationAllowed = dto.bulkGenerationAllowed;
    if (dto.maxBatchSize !== undefined) updates.maxBatchSize = dto.maxBatchSize;
    if (dto.zipFilenameFormat !== undefined) updates.zipFilenameFormat = dto.zipFilenameFormat;
    if (dto.includeIndexCsv !== undefined) updates.includeIndexCsv = dto.includeIndexCsv;
    if (dto.runInBackground !== undefined) updates.runInBackground = dto.runInBackground;

    // Status Workflow & Reprint/Reissue
    if (dto.allowMarkReissued !== undefined) updates.allowMarkReissued = dto.allowMarkReissued;
    if (dto.autoMarkDelivered !== undefined) updates.autoMarkDelivered = dto.autoMarkDelivered;
    if (dto.allowReprint !== undefined) updates.allowReprint = dto.allowReprint;
    if (dto.allowResendEmail !== undefined) updates.allowResendEmail = dto.allowResendEmail;
    if (dto.allowCorrection !== undefined) updates.allowCorrection = dto.allowCorrection;
    if (dto.requireReasonReprint !== undefined) updates.requireReasonReprint = dto.requireReasonReprint;
    if (dto.requireReasonCorrection !== undefined) updates.requireReasonCorrection = dto.requireReasonCorrection;
    if (dto.requireReasonManualGen !== undefined) updates.requireReasonManualGen = dto.requireReasonManualGen;
    if (dto.requireReasonRegenerate !== undefined) updates.requireReasonRegenerate = dto.requireReasonRegenerate;
    if (dto.requireReasonCancel !== undefined) updates.requireReasonCancel = dto.requireReasonCancel;

    // Audit & Compliance
    if (dto.retentionYears !== undefined) updates.retentionYears = dto.retentionYears;

    // Search Defaults
    if (dto.defaultDateFilter !== undefined) updates.defaultDateFilter = dto.defaultDateFilter;
    if (dto.defaultPageSize !== undefined) updates.defaultPageSize = dto.defaultPageSize;
    if (dto.exportFormatsCsv !== undefined) updates.exportFormatsCsv = dto.exportFormatsCsv;
    if (dto.exportFormatsExcel !== undefined) updates.exportFormatsExcel = dto.exportFormatsExcel;
    if (dto.exportFormatsPdf !== undefined) updates.exportFormatsPdf = dto.exportFormatsPdf;
    if (dto.maskPii !== undefined) updates.maskPii = dto.maskPii;

    if (existing.length === 0) {
      // Insert new settings (id is auto-generated by IDENTITY column)
      await this.db.insert(receiptSettings).values({
        ...updates,
        createdAt: new Date(),
      } as any);
    } else {
      // Update existing settings
      await this.db.update(receiptSettings).set(updates).where(eq(receiptSettings.id, existing[0].id));
    }

    return this.findSettings();
  }

  private parseSettings(row: any) {
    let receiptTypes: any[] = [];
    if (row.receiptTypesJson) {
      try {
        receiptTypes = JSON.parse(row.receiptTypesJson);
      } catch {
        // ignore
      }
    }

    return {
      id: row.id,
      // Numbering & Series
      receiptPrefix: row.receiptPrefix,
      startingNumber: row.startingNumber,
      paddingLength: row.paddingLength,
      noGapEnforcement: row.noGapEnforcement,
      autoCreateNewSeries: row.autoCreateNewSeries,
      manualApprovalRequired: row.manualApprovalRequired,
      receiptTypes,
      // Generation Rules
      autoGenerateOnSuccess: row.autoGenerateOnSuccess,
      generationDelay: row.generationDelay,
      autoGenerateImports: row.autoGenerateImports,
      allowManualOffline: row.allowManualOffline,
      allowManualBulk: row.allowManualBulk,
      allowBackdated: row.allowBackdated,
      backdateWindow: row.backdateWindow,
      showBackdateStamp: row.showBackdateStamp,
      requireReasonManual: row.requireReasonManual,
      // Template Rules
      defaultTemplateOnline: row.defaultTemplateOnline,
      defaultTemplateOffline: row.defaultTemplateOffline,
      template80g: row.template80g,
      templateNon80g: row.templateNon80g,
      forceRegenerateOnUpdate: row.forceRegenerateOnUpdate,
      lockContentAfterGeneration: row.lockContentAfterGeneration,
      // Mandatory Fields
      mobileRequired: row.mobileRequired,
      emailRequired: row.emailRequired,
      addressRequired: row.addressRequired,
      donationCategoryRequired: row.donationCategoryRequired,
      donationTypeRequired: row.donationTypeRequired,
      panRule: row.panRule,
      panThreshold: row.panThreshold,
      panAutoUppercase: row.panAutoUppercase,
      pincodeValidation: row.pincodeValidation,
      duplicateWarning: row.duplicateWarning,
      // Delivery Settings
      autoSendEmailOnReceiptGeneration: row.autoSendEmailOnReceiptGeneration,
      emailSubjectFormat: row.emailSubjectFormat,
      emailSenderName: row.emailSenderName,
      emailReplyTo: row.emailReplyTo,
      emailRetryAttempts: row.emailRetryAttempts,
      emailFailureAlertsNotifyAdmin: row.emailFailureAlertsNotifyAdmin,
      autoSendSmsOnReceiptGeneration: row.autoSendSmsOnReceiptGeneration,
      smsTemplate: row.smsTemplate,
      smsShortLink: row.smsShortLink,
      // Storage & Access
      storageMode: row.storageMode,
      linkSecurity: row.linkSecurity,
      linkExpiryDays: row.linkExpiryDays,
      allowRegenerationTemplate: row.allowRegenerationTemplate,
      allowRegenerationAnytime: row.allowRegenerationAnytime,
      // Bulk Operations
      bulkGenerationAllowed: row.bulkGenerationAllowed,
      maxBatchSize: row.maxBatchSize,
      zipFilenameFormat: row.zipFilenameFormat,
      includeIndexCsv: row.includeIndexCsv,
      runInBackground: row.runInBackground,
      // Status Workflow & Reprint/Reissue
      allowMarkReissued: row.allowMarkReissued,
      autoMarkDelivered: row.autoMarkDelivered,
      allowReprint: row.allowReprint,
      allowResendEmail: row.allowResendEmail,
      allowCorrection: row.allowCorrection,
      requireReasonReprint: row.requireReasonReprint,
      requireReasonCorrection: row.requireReasonCorrection,
      requireReasonManualGen: row.requireReasonManualGen,
      requireReasonRegenerate: row.requireReasonRegenerate,
      requireReasonCancel: row.requireReasonCancel,
      // Audit & Compliance
      retentionYears: row.retentionYears,
      // Search Defaults
      defaultDateFilter: row.defaultDateFilter,
      defaultPageSize: row.defaultPageSize,
      exportFormatsCsv: row.exportFormatsCsv,
      exportFormatsExcel: row.exportFormatsExcel,
      exportFormatsPdf: row.exportFormatsPdf,
      maskPii: row.maskPii,
      // Metadata
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      updatedBy: row.updatedBy,
    };
  }

  private getDefaultSettings() {
    return {
      id: null,
      // Numbering & Series
      receiptPrefix: 'ARAM/2025-26/',
      startingNumber: '00001',
      paddingLength: 5,
      noGapEnforcement: true,
      autoCreateNewSeries: true,
      manualApprovalRequired: false,
      receiptTypes: [
        { id: 'online', label: 'Online Donation', enabled: true, isDefault: true },
        { id: 'echallan_cash', label: 'E-Challan (Cash)', enabled: true, isDefault: false },
        { id: 'echallan_cheque', label: 'E-Challan (Cheque)', enabled: true, isDefault: false },
        { id: 'echallan_dd', label: 'E-Challan (DD)', enabled: true, isDefault: false },
        { id: 'echallan_bank', label: 'E-Challan (Bank Transfer)', enabled: true, isDefault: false },
      ],
      // Generation Rules
      autoGenerateOnSuccess: true,
      generationDelay: 0,
      autoGenerateImports: false,
      allowManualOffline: true,
      allowManualBulk: true,
      allowBackdated: true,
      backdateWindow: 30,
      showBackdateStamp: true,
      requireReasonManual: true,
      // Template Rules
      defaultTemplateOnline: 'template_1',
      defaultTemplateOffline: 'template_2',
      template80g: 'template_80g',
      templateNon80g: 'template_non_80g',
      forceRegenerateOnUpdate: false,
      lockContentAfterGeneration: true,
      // Mandatory Fields
      mobileRequired: true,
      emailRequired: true,
      addressRequired: false,
      donationCategoryRequired: true,
      donationTypeRequired: true,
      panRule: 'threshold',
      panThreshold: 2000,
      panAutoUppercase: true,
      pincodeValidation: true,
      duplicateWarning: true,
      // Delivery Settings
      autoSendEmailOnReceiptGeneration: true,
      emailSubjectFormat: 'Your donation receipt {receipt_no} - Aram Foundation',
      emailSenderName: 'Aram Foundation',
      emailReplyTo: 'donations@aramfoundation.org',
      emailRetryAttempts: 3,
      emailFailureAlertsNotifyAdmin: true,
      autoSendSmsOnReceiptGeneration: false,
      smsTemplate: 'Thank you for your donation! Receipt: {receipt_no}. Download: {short_link}',
      smsShortLink: true,
      // Storage & Access
      storageMode: 's3',
      linkSecurity: 'token',
      linkExpiryDays: 30,
      allowRegenerationTemplate: true,
      allowRegenerationAnytime: false,
      // Bulk Operations
      bulkGenerationAllowed: true,
      maxBatchSize: 500,
      zipFilenameFormat: 'Receipts_YYYYMMDD_Batch001.zip',
      includeIndexCsv: true,
      runInBackground: true,
      // Status Workflow & Reprint/Reissue
      allowMarkReissued: true,
      autoMarkDelivered: true,
      allowReprint: true,
      allowResendEmail: true,
      allowCorrection: true,
      requireReasonReprint: false,
      requireReasonCorrection: true,
      requireReasonManualGen: true,
      requireReasonRegenerate: true,
      requireReasonCancel: true,
      // Audit & Compliance
      retentionYears: 7,
      // Search Defaults
      defaultDateFilter: 'this_month',
      defaultPageSize: 50,
      exportFormatsCsv: true,
      exportFormatsExcel: true,
      exportFormatsPdf: true,
      maskPii: true,
      // Metadata
      createdAt: null,
      updatedAt: null,
      updatedBy: null,
    };
  }
}
