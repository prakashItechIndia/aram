import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWebsiteContentDto {
  @ApiProperty({ description: 'Section key (e.g. hero, mission_vision)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  sectionKey: string;

  @ApiProperty({ description: 'JSON content for the section' })
  @IsNotEmpty()
  @IsString()
  contentJson: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  version?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  modifiedBy?: string;
}
