import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { donationFormSettings } from '../../database/models/donation-form-settings.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import { UpdateDonationFormSettingsDto } from './dto/update-donation-form-settings.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { DonorsService } from '../donors/donors.service';

export interface DonationFormConfig {
  // Form Status
  formEnabled?: boolean;
  maintenanceMessage?: string;

  // Field Configuration
  multiCountry?: boolean;
  panRequired?: 'always' | 'threshold' | 'optional' | 'never';
  panThreshold?: number;
  addressRequired?: boolean;
  mobileRequired?: boolean;
  otpVerification?: boolean;

  // Amount Configuration
  presetAmounts?: number[];
  minAmount?: number;
  maxAmount?: number;
  allowCustomAmount?: boolean;

  // Recurring Donations
  enableRecurring?: boolean;

  recurringFrequencies?: string[];

  // Payment Options
  enabledPaymentModes?: string[];
  defaultPaymentMode?: string;

  // Form Behavior
  showDonorHistory?: boolean;
  autoFillLastDonor?: boolean;
  requireTermsAcceptance?: boolean;
  termsAndConditionsUrl?: string;
  enable80GCertificate?: boolean;
  showProgressBar?: boolean;
}

@Injectable()
export class DonationFormSettingsService {
  constructor(
    @Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>,
    private notificationsService: NotificationsService,
    private donorsService: DonorsService,
  ) {}

  /**
   * Get public donation form status (no auth required)
   */
  async getPublicStatus() {
    const current = await this.getCurrentSettings();
    return {
      formEnabled: current.formEnabled ?? true,
      maintenanceMessage: current.maintenanceMessage ?? 'Donation form is currently under maintenance. Please try again later.',
    };
  }

  /**
   * Get the current active settings
   */
  async getCurrentSettings() {
    const active = await this.db
      .select()
      .from(donationFormSettings)
      .where(eq(donationFormSettings.isActive, true))
      .orderBy(desc(donationFormSettings.createdAt));

    if (active[0]) {
      return {
        ...active[0],
        config: this.parseConfig(active[0].configJson),
      };
    }

    // Return default settings if none exist
    return {
      id: null,
      version: 'v1.0',
      isActive: false,
      formEnabled: true,
      multiCountry: false,
      panRequired: 'threshold',
      addressRequired: true,
      mobileRequired: true,
      otpVerification: false,
      maintenanceMessage: '',
      changesDescription: '',
      createdBy: null,
      createdAt: null,
      configJson: null,
      config: this.getDefaultConfig(),
    };
  }

  /**
   * Get version history (all versions)
   */
  async getVersionHistory() {
    const versions = await this.db
      .select()
      .from(donationFormSettings)
      .orderBy(desc(donationFormSettings.createdAt));

    return versions.map((v) => ({
      ...v,
      config: this.parseConfig(v.configJson),
    }));
  }

  /**
   * Get a specific version by ID
   */
  async getVersionById(id: number) {
    const version = await this.db
      .select()
      .from(donationFormSettings)
      .where(eq(donationFormSettings.id, id));

    if (!version[0]) {
      throw new NotFoundException(`Version with ID ${id} not found`);
    }

    return {
      ...version[0],
      config: this.parseConfig(version[0].configJson),
    };
  }

  /**
   * Update settings (creates a new version)
   */
  async updateSettings(dto: UpdateDonationFormSettingsDto, userId?: number) {
    // Get current active version
    const current = await this.db
      .select()
      .from(donationFormSettings)
      .where(eq(donationFormSettings.isActive, true));

    // Prepare config
    const config: DonationFormConfig = current[0]
      ? this.parseConfig(current[0].configJson)
      : this.getDefaultConfig();

    // Update config with DTO values
    if (dto.presetAmounts !== undefined) config.presetAmounts = dto.presetAmounts;
    if (dto.minAmount !== undefined) config.minAmount = dto.minAmount;
    if (dto.maxAmount !== undefined) config.maxAmount = dto.maxAmount;
    if (dto.allowCustomAmount !== undefined) config.allowCustomAmount = dto.allowCustomAmount;
    if (dto.enableRecurring !== undefined) config.enableRecurring = dto.enableRecurring;
    if (dto.recurringFrequencies !== undefined) config.recurringFrequencies = dto.recurringFrequencies;
    if (dto.enabledPaymentModes !== undefined) config.enabledPaymentModes = dto.enabledPaymentModes;
    if (dto.defaultPaymentMode !== undefined) config.defaultPaymentMode = dto.defaultPaymentMode;
    if (dto.showDonorHistory !== undefined) config.showDonorHistory = dto.showDonorHistory;
    if (dto.autoFillLastDonor !== undefined) config.autoFillLastDonor = dto.autoFillLastDonor;
    if (dto.requireTermsAcceptance !== undefined) config.requireTermsAcceptance = dto.requireTermsAcceptance;
    if (dto.termsAndConditionsUrl !== undefined) config.termsAndConditionsUrl = dto.termsAndConditionsUrl;
    if (dto.enable80GCertificate !== undefined) config.enable80GCertificate = dto.enable80GCertificate;
    if (dto.showProgressBar !== undefined) config.showProgressBar = dto.showProgressBar;
    if (dto.panThreshold !== undefined) config.panThreshold = dto.panThreshold;

    // Generate new version number
    const latestVersion = current[0]?.version || 'v1.0';
    const versionMatch = latestVersion.match(/v(\d+)\.(\d+)/);
    const majorVersion = versionMatch ? parseInt(versionMatch[1], 10) : 1;
    const minorVersion = versionMatch ? parseInt(versionMatch[2], 10) : 0;
    const newVersion = `v${majorVersion}.${minorVersion + 1}`;

    // Deactivate current version
    if (current[0]) {
      await this.db
        .update(donationFormSettings)
        .set({ isActive: false })
        .where(eq(donationFormSettings.id, current[0].id));
    }

    // Create new version
    await this.db.insert(donationFormSettings).values({
      version: newVersion,
      configJson: JSON.stringify(config),
      isActive: true,
      formEnabled: dto.formEnabled ?? config.formEnabled ?? true,
      maintenanceMessage: dto.maintenanceMessage ?? current[0]?.maintenanceMessage ?? '',
      multiCountry: dto.multiCountry ?? config.multiCountry ?? false,
      panRequired: dto.panRequired ?? config.panRequired ?? 'threshold',
      addressRequired: dto.addressRequired ?? config.addressRequired ?? true,
      mobileRequired: dto.mobileRequired ?? config.mobileRequired ?? true,
      otpVerification: dto.otpVerification ?? config.otpVerification ?? false,
      changesDescription: dto.changesDescription || 'Settings updated',
      createdBy: dto.updatedBy || (userId ? `User ${userId}` : 'System'),
      createdAt: new Date(),
    } as any);

    // Broadcast notification to all donors
    // Broadcast notification to all donors
    try {
      const donors = await this.donorsService.findAll({ page: 1, limit: 1000000, status: 'active' });
      const notificationPromises = donors.data.map((donor) =>
        this.notificationsService.create({
          userId: donor.id,
          type: 'info',
          title: 'Donation Form Updated',
          message: 'The donation form has been updated by the admin. Check it out.',
        })
      );
      await Promise.all(notificationPromises);
    } catch (error) {
      console.error('Failed to broadcast settings update notification:', error);
    }

    return this.getCurrentSettings();
  }

  /**
   * Rollback to a specific version
   */
  async rollbackToVersion(versionId: number, userId?: number) {
    // Get the target version
    const targetVersion = await this.db
      .select()
      .from(donationFormSettings)
      .where(eq(donationFormSettings.id, versionId));

    if (!targetVersion[0]) {
      throw new NotFoundException(`Version with ID ${versionId} not found`);
    }

    // Deactivate current version
    await this.db
      .update(donationFormSettings)
      .set({ isActive: false })
      .where(eq(donationFormSettings.isActive, true));

    // Generate new version number
    const latestVersion = targetVersion[0].version;
    const versionMatch = latestVersion.match(/v(\d+)\.(\d+)/);
    const majorVersion = versionMatch ? parseInt(versionMatch[1], 10) + 1 : 2;
    const newVersion = `v${majorVersion}.0`;

    // Create new version based on rollback
    await this.db.insert(donationFormSettings).values({
      version: newVersion,
      configJson: targetVersion[0].configJson,
      isActive: true,
      formEnabled: targetVersion[0].formEnabled,
      maintenanceMessage: targetVersion[0].maintenanceMessage,
      multiCountry: targetVersion[0].multiCountry,
      panRequired: targetVersion[0].panRequired,
      addressRequired: targetVersion[0].addressRequired,
      mobileRequired: targetVersion[0].mobileRequired,
      otpVerification: targetVersion[0].otpVerification,
      changesDescription: `Rolled back to ${targetVersion[0].version}`,
      createdBy: userId ? `User ${userId}` : 'System',
      createdAt: new Date(),
    } as any);

    // Broadcast notification to all donors (also for rollback)
    try {
      const donors = await this.donorsService.findAll({ page: 1, limit: 1000000, status: 'active' });
      const notificationPromises = donors.data.map((donor) =>
        this.notificationsService.create({
          userId: donor.id,
          type: 'info',
          title: 'Donation Form Updated',
          message: 'The donation form has been updated (rollback) by the admin. Check it out.',
        })
      );
      await Promise.all(notificationPromises);
    } catch (error) {
      console.error('Failed to broadcast rollback notification:', error);
    }

    return this.getCurrentSettings();
  }

  /**
   * Parse config JSON
   */
  private parseConfig(configJson: string | null): DonationFormConfig {
    if (!configJson) {
      return this.getDefaultConfig();
    }

    try {
      return JSON.parse(configJson);
    } catch (error) {
      console.error('Error parsing config JSON:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): DonationFormConfig {
    return {
      formEnabled: true,
      maintenanceMessage: '',
      multiCountry: false,
      panRequired: 'threshold',
      panThreshold: 2000,
      addressRequired: true,
      mobileRequired: true,
      otpVerification: false,
      presetAmounts: [500, 1000, 2500, 5000, 10000],
      minAmount: 100,
      maxAmount: 1000000,
      allowCustomAmount: true,
      enableRecurring: true,
      recurringFrequencies: ['monthly', 'quarterly', 'yearly'],
      enabledPaymentModes: ['upi', 'netbanking', 'card', 'wallet'],
      defaultPaymentMode: 'upi',
      showDonorHistory: true,
      autoFillLastDonor: true,
      requireTermsAcceptance: true,
      termsAndConditionsUrl: '/terms-and-conditions',
      enable80GCertificate: true,
      showProgressBar: true,
    };
  }
}
