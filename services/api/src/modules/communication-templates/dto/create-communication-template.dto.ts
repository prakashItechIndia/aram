import { IsString, IsOptional, IsBoolean, IsIn, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunicationTemplateDto {
  @ApiPropertyOptional({ example: 'Receipt Email Template' })
  @IsString()
  @MaxLength(128)
  name: string;

  @ApiPropertyOptional({ example: 'Transactional', enum: ['Transactional', 'Marketing', 'Operational'] })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  category?: string;

  @ApiPropertyOptional({ example: 'Email', enum: ['Email', 'SMS'] })
  @IsString()
  @IsIn(['Email', 'SMS'])
  type: 'Email' | 'SMS';

  @ApiPropertyOptional({ example: 'Your Donation Receipt - {receipt_number}' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiPropertyOptional({ description: 'Email body or SMS content' })
  @IsOptional()
  @IsString()
  bodyContent?: string;

  @ApiPropertyOptional({ description: 'JSON: merge variable definitions or options (attachmentUrls, etc.)' })
  @IsOptional()
  @IsString()
  variablesJson?: string;

  @ApiPropertyOptional({ example: 'DLT_TEMPLATE_ID_123' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  dltTemplateId?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'Draft', enum: ['Draft', 'Published', 'Archived'] })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  status?: string;

  @ApiPropertyOptional({ description: 'Display name of user who last updated' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  updatedBy?: string;
}
