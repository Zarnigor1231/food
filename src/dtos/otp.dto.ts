import { IsNotEmpty, IsNumber, IsEmail } from 'class-validator';

export class GenerateOtpByEmailDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

export class ConfirmOtpDto extends GenerateOtpByEmailDto {
  @IsNumber()
  @IsNotEmpty()
  public code: number;
}
