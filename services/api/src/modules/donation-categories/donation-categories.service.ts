import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module';
import { donationCategories } from '../../database/models/donation-categories.model';
import { eq, desc } from 'drizzle-orm';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { CreateDonationCategoryDto } from './dto/create-donation-category.dto';
import type { UpdateDonationCategoryDto } from './dto/update-donation-category.dto';

@Injectable()
export class DonationCategoriesService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) {}

  async findAll(includeInactive = false) {
    const rows = includeInactive
      ? await this.db.select().from(donationCategories)
      : await this.db.select().from(donationCategories).where(eq(donationCategories.isDeleted, false));

    return rows.map((row) => this.parseCategory(row));
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(donationCategories).where(eq(donationCategories.id, id));
    const row = rows[0];
    if (!row) return null;
    return this.parseCategory(row);
  }

  async create(dto: CreateDonationCategoryDto) {
    const values = {
      categoryCode: dto.typeCode,
      displayName: dto.name,
      description: dto.description || undefined,
      publicVisibility: dto.visibleOnForm ?? true,
      sortOrder: dto.sortOrder ?? 999,
      is80gEligible: dto.eligible80G ?? false,
      tagLabel: dto.tagLabel || undefined,
      highlighted: dto.highlighted ?? false,
      isDefault: dto.isDefault ?? false,
      suggestedAmounts: dto.presetAmounts ? JSON.stringify(dto.presetAmounts) : undefined,
      minAmount: dto.minAmount || undefined,
      maxAmount: dto.maxAmount || undefined,
      allowCustomAmount: dto.allowCustomAmount ?? true,
      recurringAllowed: dto.recurringAllowed ?? false,
      recurringDefaultChecked: dto.recurringDefaultChecked ?? false,
      receiptEnabled: dto.receiptEnabled ?? true,
      template80g: dto.template80G || undefined,
      templateNon80g: dto.templateNon80G || undefined,
      autoEmailReceipt: dto.autoEmailReceipt ?? true,
      autoSmsReceipt: dto.autoSMSReceipt ?? false,
      receiptDescription: dto.receiptDescription || undefined,
      panRule: dto.panRule || undefined,
      panThreshold: dto.panThreshold || undefined,
      addressRequired: dto.addressRequired ?? false,
      mobileRequired: dto.mobileRequired ?? true,
      showPurposeField: dto.showPurposeField ?? true,
      allowAnonymous: dto.allowAnonymous ?? false,
      allowedGateways: dto.allowedGateways ? JSON.stringify(dto.allowedGateways) : undefined,
      allowedPaymentMethods: dto.allowedPaymentMethods ? JSON.stringify(dto.allowedPaymentMethods) : undefined,
      internationalAllowed: dto.internationalAllowed ?? false,
      accountingHead: dto.accountingHead || undefined,
      costCenter: dto.costCenter || undefined,
      taxCategory: dto.taxCategory || undefined,
      reportGrouping: dto.reportGrouping || undefined,
      isDeleted: false,
    };

    await this.db.insert(donationCategories).values(values as any);

    const rows = await this.db.select().top(1).from(donationCategories).orderBy(desc(donationCategories.id));
    const row = rows[0];
    if (!row) throw new NotFoundException('Category not found after create');
    return this.parseCategory(row);
  }

  async update(id: number, dto: UpdateDonationCategoryDto) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Category #${id} not found`);

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (dto.typeCode !== undefined) updates.categoryCode = dto.typeCode;
    if (dto.name !== undefined) updates.displayName = dto.name;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.visibleOnForm !== undefined) updates.publicVisibility = dto.visibleOnForm;
    if (dto.sortOrder !== undefined) updates.sortOrder = dto.sortOrder;
    if (dto.eligible80G !== undefined) updates.is80gEligible = dto.eligible80G;
    if (dto.tagLabel !== undefined) updates.tagLabel = dto.tagLabel;
    if (dto.highlighted !== undefined) updates.highlighted = dto.highlighted;
    if (dto.isDefault !== undefined) updates.isDefault = dto.isDefault;
    if (dto.presetAmounts !== undefined) updates.suggestedAmounts = JSON.stringify(dto.presetAmounts);
    if (dto.minAmount !== undefined) updates.minAmount = dto.minAmount;
    if (dto.maxAmount !== undefined) updates.maxAmount = dto.maxAmount;
    if (dto.allowCustomAmount !== undefined) updates.allowCustomAmount = dto.allowCustomAmount;
    if (dto.recurringAllowed !== undefined) updates.recurringAllowed = dto.recurringAllowed;
    if (dto.recurringDefaultChecked !== undefined) updates.recurringDefaultChecked = dto.recurringDefaultChecked;
    if (dto.receiptEnabled !== undefined) updates.receiptEnabled = dto.receiptEnabled;
    if (dto.template80G !== undefined) updates.template80g = dto.template80G;
    if (dto.templateNon80G !== undefined) updates.templateNon80g = dto.templateNon80G;
    if (dto.autoEmailReceipt !== undefined) updates.autoEmailReceipt = dto.autoEmailReceipt;
    if (dto.autoSMSReceipt !== undefined) updates.autoSmsReceipt = dto.autoSMSReceipt;
    if (dto.receiptDescription !== undefined) updates.receiptDescription = dto.receiptDescription;
    if (dto.panRule !== undefined) updates.panRule = dto.panRule;
    if (dto.panThreshold !== undefined) updates.panThreshold = dto.panThreshold;
    if (dto.addressRequired !== undefined) updates.addressRequired = dto.addressRequired;
    if (dto.mobileRequired !== undefined) updates.mobileRequired = dto.mobileRequired;
    if (dto.showPurposeField !== undefined) updates.showPurposeField = dto.showPurposeField;
    if (dto.allowAnonymous !== undefined) updates.allowAnonymous = dto.allowAnonymous;
    if (dto.allowedGateways !== undefined) updates.allowedGateways = JSON.stringify(dto.allowedGateways);
    if (dto.allowedPaymentMethods !== undefined) updates.allowedPaymentMethods = JSON.stringify(dto.allowedPaymentMethods);
    if (dto.internationalAllowed !== undefined) updates.internationalAllowed = dto.internationalAllowed;
    if (dto.accountingHead !== undefined) updates.accountingHead = dto.accountingHead;
    if (dto.costCenter !== undefined) updates.costCenter = dto.costCenter;
    if (dto.taxCategory !== undefined) updates.taxCategory = dto.taxCategory;
    if (dto.reportGrouping !== undefined) updates.reportGrouping = dto.reportGrouping;

    await this.db.update(donationCategories).set(updates).where(eq(donationCategories.id, id));
    return this.findById(id);
  }

  async remove(id: number) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Category #${id} not found`);
    
    // Soft delete
    await this.db.update(donationCategories).set({ isDeleted: true, updatedAt: new Date() }).where(eq(donationCategories.id, id));
    return { deleted: true, id };
  }

  private parseCategory(row: any) {
    // Parse JSON fields
    let presetAmounts: number[] = [];
    if (row.suggestedAmounts) {
      try {
        presetAmounts = JSON.parse(row.suggestedAmounts);
      } catch {
        // ignore
      }
    }

    let allowedGateways: string[] = [];
    if (row.allowedGateways) {
      try {
        allowedGateways = JSON.parse(row.allowedGateways);
      } catch {
        // ignore
      }
    }

    let allowedPaymentMethods: string[] = [];
    if (row.allowedPaymentMethods) {
      try {
        allowedPaymentMethods = JSON.parse(row.allowedPaymentMethods);
      } catch {
        // ignore
      }
    }

    return {
      id: row.id,
      name: row.displayName,
      typeCode: row.categoryCode,
      description: row.description,
      status: row.isDeleted ? 'inactive' : 'active',
      visibleOnForm: row.publicVisibility,
      eligible80G: row.is80gEligible,
      sortOrder: row.sortOrder,
      tagLabel: row.tagLabel,
      highlighted: row.highlighted,
      isDefault: row.isDefault,
      presetAmounts,
      minAmount: row.minAmount,
      maxAmount: row.maxAmount,
      allowCustomAmount: row.allowCustomAmount,
      recurringAllowed: row.recurringAllowed,
      recurringDefaultChecked: row.recurringDefaultChecked,
      receiptEnabled: row.receiptEnabled,
      template80G: row.template80g,
      templateNon80G: row.templateNon80g,
      autoEmailReceipt: row.autoEmailReceipt,
      autoSMSReceipt: row.autoSmsReceipt,
      receiptDescription: row.receiptDescription,
      panRule: row.panRule,
      panThreshold: row.panThreshold,
      addressRequired: row.addressRequired,
      mobileRequired: row.mobileRequired,
      showPurposeField: row.showPurposeField,
      allowAnonymous: row.allowAnonymous,
      allowedGateways,
      allowedPaymentMethods,
      internationalAllowed: row.internationalAllowed,
      accountingHead: row.accountingHead,
      costCenter: row.costCenter,
      taxCategory: row.taxCategory,
      reportGrouping: row.reportGrouping,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
  async seedDefaults() {
    const defaults = [
      { code: 'aram-sei', label: 'Aram Sei Fund' },
      { code: 'building', label: 'Building Fund' },
      { code: 'education', label: 'Education Fund' },
      { code: 'general', label: 'General Fund' },
      { code: 'medical', label: 'Medical Fund' },
      { code: 'sairam-sap', label: 'Sairam SAP' },
    ];

    const results = [];
    for (const def of defaults) {
      const existing = await this.db
        .select()
        .from(donationCategories)
        .where(eq(donationCategories.categoryCode, def.code));
      
      if (!existing.length) {
        // Create new
        await this.create({
          typeCode: def.code,
          name: def.label,
          description: `${def.label} donations`,
          visibleOnForm: true,
          sortOrder: 1,
          isDefault: def.code === 'general',
          eligible80G: true,
          receiptEnabled: true,
          autoEmailReceipt: true,
          allowCustomAmount: true,
          allowAnonymous: false,
          mobileRequired: true,
          addressRequired: true,
        } as any);
        results.push(`Created ${def.label}`);
      } else {
        results.push(`Exists ${def.label}`);
      }
    }
    return results;
  }
}
