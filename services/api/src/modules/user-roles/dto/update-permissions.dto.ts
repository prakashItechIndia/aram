import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionItemDto {
  @ApiProperty({ example: 'dashboard' })
  @IsString()
  permissionKey: string;

  @ApiProperty()
  @IsBoolean()
  canCreate: boolean;

  @ApiProperty()
  @IsBoolean()
  canUpdate: boolean;

  @ApiProperty()
  @IsBoolean()
  canView: boolean;

  @ApiProperty()
  @IsBoolean()
  canDelete: boolean;
}

export class UpdatePermissionsDto {
  @ApiProperty({ type: [PermissionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionItemDto)
  permissions: PermissionItemDto[];
}
