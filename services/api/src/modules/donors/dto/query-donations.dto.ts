import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDonationsDto {
    @ApiPropertyOptional({ description: 'Search by receipt number' })
    @IsOptional()
    @IsString()
    searchReceipt?: string;

    @ApiPropertyOptional({ description: 'Filter by financial year (e.g., fy2024-25)' })
    @IsOptional()
    @IsString()
    financialYear?: string;

    @ApiPropertyOptional({ description: 'Filter by donation type (e.g., aram-sei, building)' })
    @IsOptional()
    @IsString()
    donationType?: string;

    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}
