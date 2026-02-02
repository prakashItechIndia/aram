import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module';
import { featureConfig } from '../../database/models/feature-config.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import { CONFIG_KEYS, type ConfigKey } from './config-keys.constant';
import type { DonationFormConfigDto } from './dto/feature-config.dto';

@Injectable()
export class FeatureConfigService {
  private cache: Map<string, { value: string | null; isEnabled: boolean }> | null = null;

  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  /**
   * Load all feature config rows and cache. Call this after admin updates config.
   */
  async refreshConfigCache(): Promise<void> {
    const rows = await this.db.select().from(featureConfig);
    this.cache = new Map();
    for (const row of rows) {
      this.cache.set(row.key, {
        value: row.value ?? null,
        isEnabled: Boolean(row.isEnabled),
      });
    }
  }

  private getCached(key: string): { value: string | null; isEnabled: boolean } | undefined {
    return this.cache?.get(key);
  }

  /**
   * Get raw config value (string/JSON). Returns undefined if not set.
   */
  async getValue(key: ConfigKey): Promise<string | null | undefined> {
    if (!this.cache) await this.refreshConfigCache();
    const entry = this.getCached(key);
    return entry?.value ?? undefined;
  }

  /**
   * Check if a feature is enabled (boolean flag).
   */
  async isEnabled(key: ConfigKey): Promise<boolean> {
    if (!this.cache) await this.refreshConfigCache();
    const entry = this.getCached(key);
    if (entry === undefined) return false;
    if (entry.value !== null && entry.value !== undefined) {
      const v = entry.value.toLowerCase();
      if (v === 'true' || v === '1') return true;
      if (v === 'false' || v === '0') return false;
    }
    return Boolean(entry?.isEnabled);
  }

  /**
   * Get donation form config as a single object for frontend and backend logic.
   * Drives: logic, inputs, UI visibility, SMS, email.
   */
  async getDonationFormConfig(): Promise<DonationFormConfigDto> {
    if (!this.cache) await this.refreshConfigCache();

    const getBool = (k: ConfigKey) => this.isEnabled(k);
    const getStr = (k: ConfigKey) => this.getValue(k);
    const getNum = async (k: ConfigKey) => {
      const v = await this.getValue(k);
      if (v == null) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };
    const getJson = async (k: ConfigKey) => {
      const v = await this.getValue(k);
      if (v == null) return undefined;
      try {
        return JSON.parse(v) as number[];
      } catch {
        return undefined;
      }
    };

    return {
      donationFormEnabled: await getBool(CONFIG_KEYS.DONATION_FORM_ENABLED as ConfigKey),
      maintenanceMessage: (await getStr(CONFIG_KEYS.DONATION_FORM_MAINTENANCE_MESSAGE as ConfigKey)) ?? undefined,
      testMode: await getBool(CONFIG_KEYS.TEST_MODE as ConfigKey),
      multiCountrySupport: await getBool(CONFIG_KEYS.MULTI_COUNTRY_SUPPORT as ConfigKey),
      panRequirement: (await getStr(CONFIG_KEYS.PAN_REQUIREMENT as ConfigKey)) ?? undefined,
      panThresholdAmount: await getNum(CONFIG_KEYS.PAN_THRESHOLD_AMOUNT as ConfigKey),
      requireAddress: await getBool(CONFIG_KEYS.REQUIRE_ADDRESS as ConfigKey),
      requireMobile: await getBool(CONFIG_KEYS.REQUIRE_MOBILE as ConfigKey),
      mobileOtpVerification: await getBool(CONFIG_KEYS.MOBILE_OTP_VERIFICATION as ConfigKey),
      presetAmounts: await getJson(CONFIG_KEYS.PRESET_AMOUNTS as ConfigKey),
      minAmount: await getNum(CONFIG_KEYS.MIN_AMOUNT as ConfigKey),
      maxAmount: await getNum(CONFIG_KEYS.MAX_AMOUNT as ConfigKey),
      suggestRecurring: await getBool(CONFIG_KEYS.SUGGEST_RECURRING as ConfigKey),
      sendReceiptEmail: await getBool(CONFIG_KEYS.SEND_RECEIPT_EMAIL as ConfigKey),
      sendReceiptSms: await getBool(CONFIG_KEYS.SEND_RECEIPT_SMS as ConfigKey),
      send80GEmail: await getBool(CONFIG_KEYS.SEND_80G_EMAIL as ConfigKey),
    };
  }

  /**
   * Get all config items (for admin UI and public config endpoint).
   */
  async getAllConfig(): Promise<{ items: Array<{ key: string; value: string | null; isEnabled: boolean }>; donationForm: DonationFormConfigDto }> {
    if (!this.cache) await this.refreshConfigCache();
    const items = Array.from(this.cache?.entries() ?? []).map(([key, v]) => ({
      key,
      value: v.value,
      isEnabled: v.isEnabled,
    }));
    const donationForm = await this.getDonationFormConfig();
    return { items, donationForm };
  }
}
