import { IsNotEmpty, IsNumber, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class PassRecoveryDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNumber()
  @IsNotEmpty()
  public code: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}
