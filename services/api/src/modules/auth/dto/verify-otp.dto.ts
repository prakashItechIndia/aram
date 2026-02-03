import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
    mobileNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
    otpCode: string;
}
