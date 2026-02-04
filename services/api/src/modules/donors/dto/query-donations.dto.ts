import { IsOptional, IsString } from 'class-validator';
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
}
