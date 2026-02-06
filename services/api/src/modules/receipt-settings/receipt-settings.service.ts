import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module';
import { receiptSettings } from '../../database/models/receipt-settings.model';
import { auditLog } from '../../database/models/audit-log.model';
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



    // Mandatory Fields
    if (dto.mobileRequired !== undefined) updates.mobileRequired = dto.mobileRequired;
    if (dto.emailRequired !== undefined) updates.emailRequired = dto.emailRequired;
    if (dto.addressRequired !== undefined) updates.addressRequired = dto.addressRequired;
    if (dto.donationCategoryRequired !== undefined) updates.donationCategoryRequired = dto.donationCategoryRequired;
    if (dto.donationTypeRequired !== undefined) updates.donationTypeRequired = dto.donationTypeRequired;
    if (dto.panRule !== undefined) updates.panRule = dto.panRule;
    if (dto.panThreshold !== undefined) updates.panThreshold = dto.panThreshold;
    if (dto.panAutoUppercase !== undefined) updates.panAutoUppercase = dto.panAutoUppercase;


    // Delivery Settings
    if (dto.autoSendEmailOnReceiptGeneration !== undefined) updates.autoSendEmailOnReceiptGeneration = dto.autoSendEmailOnReceiptGeneration;
    if (dto.emailSubjectFormat !== undefined) updates.emailSubjectFormat = dto.emailSubjectFormat;
    if (dto.emailSenderName !== undefined) updates.emailSenderName = dto.emailSenderName;
    if (dto.emailReplyTo !== undefined) updates.emailReplyTo = dto.emailReplyTo;

    if (dto.emailFailureAlertsNotifyAdmin !== undefined) updates.emailFailureAlertsNotifyAdmin = dto.emailFailureAlertsNotifyAdmin;
    if (dto.autoSendSmsOnReceiptGeneration !== undefined) updates.autoSendSmsOnReceiptGeneration = dto.autoSendSmsOnReceiptGeneration;
    if (dto.smsShortLink !== undefined) updates.smsShortLink = dto.smsShortLink;


    // Reprint & Reissue
    if (dto.allowReprint !== undefined) updates.allowReprint = dto.allowReprint;
    if (dto.allowResendEmail !== undefined) updates.allowResendEmail = dto.allowResendEmail;
    if (dto.allowCorrection !== undefined) updates.allowCorrection = dto.allowCorrection;
    if (dto.requireReasonReprint !== undefined) updates.requireReasonReprint = dto.requireReasonReprint;
    if (dto.requireReasonCorrection !== undefined) updates.requireReasonCorrection = dto.requireReasonCorrection;
    if (dto.requireReasonManualGen !== undefined) updates.requireReasonManualGen = dto.requireReasonManualGen;
    if (dto.requireReasonRegenerate !== undefined) updates.requireReasonRegenerate = dto.requireReasonRegenerate;
    if (dto.requireReasonCancel !== undefined) updates.requireReasonCancel = dto.requireReasonCancel;

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

    // Log to audit trail if reasonForChange is provided
    if (dto.reasonForChange) {
      await this.db.insert(auditLog).values({
        userId: null, // Could be extracted from JWT token if available
        action: 'UPDATE_RECEIPT_SETTINGS',
        entityType: 'receipt_settings',
        entityId: existing.length > 0 ? String(existing[0].id) : '1',
        detailsJson: JSON.stringify({
          reason: dto.reasonForChange,
          updatedBy: dto.updatedBy || 'System',
          timestamp: new Date().toISOString(),
        }),
        ipAddress: null, // Could be extracted from request if available
      } as any);
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

      // Mandatory Fields
      mobileRequired: row.mobileRequired,
      emailRequired: row.emailRequired,
      addressRequired: row.addressRequired,
      donationCategoryRequired: row.donationCategoryRequired,
      donationTypeRequired: row.donationTypeRequired,
      panRule: row.panRule,
      panThreshold: row.panThreshold,
      panAutoUppercase: row.panAutoUppercase,

      // Delivery Settings
      autoSendEmailOnReceiptGeneration: row.autoSendEmailOnReceiptGeneration,
      emailSubjectFormat: row.emailSubjectFormat,
      emailSenderName: row.emailSenderName,
      emailReplyTo: row.emailReplyTo,

      emailFailureAlertsNotifyAdmin: row.emailFailureAlertsNotifyAdmin,
      autoSendSmsOnReceiptGeneration: row.autoSendSmsOnReceiptGeneration,
      smsShortLink: row.smsShortLink,

      // Reprint & Reissue
      allowReprint: row.allowReprint,
      allowResendEmail: row.allowResendEmail,
      allowCorrection: row.allowCorrection,
      requireReasonReprint: row.requireReasonReprint,
      requireReasonCorrection: row.requireReasonCorrection,
      requireReasonManualGen: row.requireReasonManualGen,
      requireReasonRegenerate: row.requireReasonRegenerate,
      requireReasonCancel: row.requireReasonCancel,
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

      // Mandatory Fields
      mobileRequired: true,
      emailRequired: true,
      addressRequired: false,
      donationCategoryRequired: true,
      donationTypeRequired: true,
      panRule: 'threshold',
      panThreshold: 2000,
      panAutoUppercase: true,

      // Delivery Settings
      autoSendEmailOnReceiptGeneration: true,
      emailSubjectFormat: 'Your donation receipt {receipt_no} - Aram Foundation',
      emailSenderName: 'Aram Foundation',
      emailReplyTo: 'donations@aramfoundation.org',

      emailFailureAlertsNotifyAdmin: true,
      autoSendSmsOnReceiptGeneration: false,
      smsShortLink: true,

      // Reprint & Reissue
      allowReprint: true,
      allowResendEmail: true,
      allowCorrection: true,
      requireReasonReprint: false,
      requireReasonCorrection: true,
      requireReasonManualGen: true,
      requireReasonRegenerate: true,
      requireReasonCancel: true,
      // Metadata
      createdAt: null,
      updatedAt: null,
      updatedBy: null,
    };
  }
}
