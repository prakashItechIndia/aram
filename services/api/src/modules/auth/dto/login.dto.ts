import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Please provide email or mobile number' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
