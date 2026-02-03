import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'OldPass123' })
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @ApiProperty({
        example: 'NewPass@123',
        description: 'At least 8 chars, one uppercase, one lowercase, one number, one special char',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password to weak',
    })
    newPassword: string;
}
