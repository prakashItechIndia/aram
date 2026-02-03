import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckMobileDto {
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
    mobileNumber: string;
}
