import { IsOptional, IsEmail, IsString, IsObject, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TestSendCommunicationTemplateDto {
  @ApiPropertyOptional({ example: 'admin@aram.org' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s-]{10,20}$/, { message: 'Invalid mobile number' })
  mobile?: string;

  @ApiPropertyOptional({
    description: 'Sample values for merge variables',
    example: { donor_name: 'Test User', amount: '₹500', receipt_number: 'RCP-TEST' },
  })
  @IsOptional()
  @IsObject()
  sampleVariables?: Record<string, string>;
}
