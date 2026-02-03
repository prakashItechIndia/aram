import { IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PreviewCommunicationTemplateDto {
  @ApiPropertyOptional({
    description: 'Sample values for merge variables, e.g. { donor_name: "John", amount: "1000" }',
    example: { donor_name: 'John Doe', amount: '₹1,000', receipt_number: 'RCP-001' },
  })
  @IsOptional()
  @IsObject()
  sampleVariables?: Record<string, string>;
}
