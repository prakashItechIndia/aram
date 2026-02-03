import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty({ example: 'John Doe', required: false })
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @ApiProperty({ example: '9876543210', required: false })
    @IsOptional()
    @IsString()
    mobileNumber?: string;
}
