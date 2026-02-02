import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'admin@aram.org' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
