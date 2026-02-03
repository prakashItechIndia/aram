import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin' })
  @IsString()
  @MaxLength(64)
  name: string;

  @ApiPropertyOptional({ example: 'Administrative access' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
