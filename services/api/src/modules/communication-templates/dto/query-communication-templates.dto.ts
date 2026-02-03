import { IsOptional, IsString, IsIn, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCommunicationTemplatesDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ enum: ['Email', 'SMS'] })
  @IsOptional()
  @IsString()
  @IsIn(['Email', 'SMS'])
  channel?: string;

  @ApiPropertyOptional({ enum: ['Transactional', 'Marketing', 'Operational'] })
  @IsOptional()
  @IsString()
  @IsIn(['Transactional', 'Marketing', 'Operational'])
  category?: string;

  @ApiPropertyOptional({ enum: ['Draft', 'Published', 'Archived'] })
  @IsOptional()
  @IsString()
  @IsIn(['Draft', 'Published', 'Archived'])
  status?: string;

  @ApiPropertyOptional({ description: 'Search by template name' })
  @IsOptional()
  @IsString()
  search?: string;
}
