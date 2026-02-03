import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc, and, like, sql } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { communicationTemplates } from '../../database/models/communication-templates.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import type { CreateCommunicationTemplateDto } from './dto/create-communication-template.dto';
import type { UpdateCommunicationTemplateDto } from './dto/update-communication-template.dto';
import type { QueryCommunicationTemplatesDto } from './dto/query-communication-templates.dto';
import { EmailService } from '../email/email.service';

const DEFAULT_SAMPLE_VARS: Record<string, string> = {
  donor_name: 'Sample Donor',
  amount: '₹1,000',
  receipt_number: 'RCP-001',
  donation_date: '15 Jan 2026',
  category: 'General',
  campaign_name: 'Sample Campaign',
  transaction_id: 'TXN-001',
  payment_method: 'UPI',
  support_email: 'support@aram.org',
  name: 'Sample Donor',
  receipt_no: 'RCP-001',
};

function replaceMergeVariables(text: string | null | undefined, vars: Record<string, string>): string {
  if (!text) return '';
  let out = text;
  const merged = { ...DEFAULT_SAMPLE_VARS, ...vars };
  for (const [key, value] of Object.entries(merged)) {
    out = out.replace(new RegExp(`\\{${key}\\}`, 'gi'), value);
    out = out.replace(new RegExp(`\\{${key.replace(/_/g, '')}\\}`, 'gi'), value);
  }
  return out;
}

function toApiRow(row: typeof communicationTemplates.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    channel: row.type === 'Email' ? 'Email' : 'SMS',
    category: row.category ?? 'Transactional',
    status: row.status ?? 'Draft',
    subject: row.subject ?? undefined,
    content: row.bodyContent ?? '',
    bodyContent: row.bodyContent ?? '',
    variablesJson: row.variablesJson ?? undefined,
    dltTemplateId: row.dltTemplateId ?? undefined,
    isActive: row.isActive ?? true,
    updatedOn: row.updatedAt ?? row.createdAt ?? new Date().toISOString(),
    updatedBy: row.updatedBy ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

@Injectable()
export class CommunicationTemplatesService {
  constructor(
    @Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>,
    private emailService: EmailService,
  ) {}

  async findAll(query: QueryCommunicationTemplatesDto) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));
    const offset = (page - 1) * limit;

    const conditions = [];
    if (query.channel) {
      conditions.push(eq(communicationTemplates.type, query.channel));
    }
    if (query.category) {
      conditions.push(eq(communicationTemplates.category, query.category));
    }
    if (query.status) {
      conditions.push(eq(communicationTemplates.status, query.status));
    }
    if (query.search?.trim()) {
      conditions.push(like(communicationTemplates.name, `%${query.search.trim()}%`));
    }
    const whereClause = conditions.length ? and(...conditions) : undefined;

    const countResult = await this.db
      .select({ count: sql<number>`count_big(*)` })
      .from(communicationTemplates)
      .where(whereClause);
    const total = Number(countResult[0]?.count ?? 0);

    const allRows = await this.db
      .select()
      .from(communicationTemplates)
      .where(whereClause)
      .orderBy(desc(communicationTemplates.createdAt), desc(communicationTemplates.id));
    const rows = allRows.slice(offset, offset + limit);
    const items = rows.map(toApiRow);

    const statsResult = await this.db
      .select({
        type: communicationTemplates.type,
        status: communicationTemplates.status,
        count: sql<number>`count_big(*)`,
      })
      .from(communicationTemplates)
      .groupBy(communicationTemplates.type, communicationTemplates.status);
    let totalEmail = 0;
    let totalSms = 0;
    let totalPublished = 0;
    for (const row of statsResult) {
      const c = Number(row.count ?? 0);
      if (row.type === 'Email') totalEmail += c;
      if (row.type === 'SMS') totalSms += c;
      if (row.status === 'Published') totalPublished += c;
    }

    return { items, total, page, limit, totalEmail, totalSms, totalPublished };
  }

  async findById(id: number) {
    const rows = await this.db
      .select()
      .top(1)
      .from(communicationTemplates)
      .where(eq(communicationTemplates.id, id));
    const row = rows[0];
    if (!row) return null;
    return toApiRow(row);
  }

  async create(dto: CreateCommunicationTemplateDto, updatedBy?: string) {
    const now = new Date().toISOString();
    const values = {
      name: dto.name,
      category: dto.category ?? 'Transactional',
      type: dto.type,
      subject: dto.subject ?? null,
      bodyContent: dto.bodyContent ?? null,
      variablesJson: dto.variablesJson ?? null,
      dltTemplateId: dto.dltTemplateId ?? null,
      isActive: dto.isActive ?? true,
      status: dto.status ?? 'Draft',
      updatedBy: dto.updatedBy ?? updatedBy ?? null,
      updatedAt: now,
    };
    await this.db.insert(communicationTemplates).values(values as any);
    const all = await this.db
      .select()
      .from(communicationTemplates)
      .orderBy(desc(communicationTemplates.id));
    const created = all[0];
    if (!created) throw new NotFoundException('Template not found after create');
    return toApiRow(created);
  }

  async update(id: number, dto: UpdateCommunicationTemplateDto, updatedBy?: string) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Template #${id} not found`);

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
      updatedBy: dto.updatedBy ?? updatedBy ?? existing.updatedBy,
    };
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.category !== undefined) updates.category = dto.category;
    if (dto.type !== undefined) updates.type = dto.type;
    if (dto.subject !== undefined) updates.subject = dto.subject;
    if (dto.bodyContent !== undefined) updates.bodyContent = dto.bodyContent;
    if (dto.variablesJson !== undefined) updates.variablesJson = dto.variablesJson;
    if (dto.dltTemplateId !== undefined) updates.dltTemplateId = dto.dltTemplateId;
    if (dto.isActive !== undefined) updates.isActive = dto.isActive;
    if (dto.status !== undefined) updates.status = dto.status;

    await this.db
      .update(communicationTemplates)
      .set(updates as any)
      .where(eq(communicationTemplates.id, id));
    return this.findById(id);
  }

  async delete(id: number) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException(`Template #${id} not found`);
    await this.db.delete(communicationTemplates).where(eq(communicationTemplates.id, id));
    return { success: true };
  }

  async duplicate(id: number, updatedBy?: string) {
    const existing = await this.db
      .select()
      .top(1)
      .from(communicationTemplates)
      .where(eq(communicationTemplates.id, id));
    const row = existing[0];
    if (!row) throw new NotFoundException(`Template #${id} not found`);

    const dto: CreateCommunicationTemplateDto = {
      name: `${row.name} (Copy)`,
      category: row.category ?? undefined,
      type: row.type as 'Email' | 'SMS',
      subject: row.subject ?? undefined,
      bodyContent: row.bodyContent ?? undefined,
      variablesJson: row.variablesJson ?? undefined,
      dltTemplateId: row.dltTemplateId ?? undefined,
      isActive: row.isActive ?? true,
      status: 'Draft',
      updatedBy: updatedBy ?? row.updatedBy ?? undefined,
    };
    return this.create(dto, updatedBy);
  }

  async getPreview(id: number, sampleVariables?: Record<string, string>) {
    const template = await this.findById(id);
    if (!template) throw new NotFoundException(`Template #${id} not found`);
    const vars = sampleVariables ?? {};
    const subject = template.subject
      ? replaceMergeVariables(template.subject, vars)
      : undefined;
    const body = replaceMergeVariables(template.content ?? template.bodyContent, vars);
    return { subject, body };
  }

  async testSend(
    id: number,
    dto: { email?: string; mobile?: string; sampleVariables?: Record<string, string> },
  ) {
    const template = await this.findById(id);
    if (!template) throw new NotFoundException(`Template #${id} not found`);
    const vars = dto.sampleVariables ?? {};
    const subject = template.subject
      ? replaceMergeVariables(template.subject, vars)
      : 'Test - ' + (template.name || 'Template');
    const body = replaceMergeVariables(template.content ?? template.bodyContent, vars);

    if (template.channel === 'Email') {
      const to = dto.email?.trim();
      if (!to) throw new NotFoundException('Test email address is required for email templates');
      await this.emailService.sendTemplate(to, subject, body);
      return { success: true, message: `Test email sent to ${to}` };
    }

    if (template.channel === 'SMS') {
      const mobile = dto.mobile?.trim();
      if (!mobile) throw new NotFoundException('Test mobile number is required for SMS templates');
      // SMS sending would go here (e.g. Twilio, MSG91). For now acknowledge only.
      return { success: true, message: `Test SMS would be sent to ${mobile} (SMS provider not configured)` };
    }

    throw new NotFoundException('Unknown template channel');
  }
}
