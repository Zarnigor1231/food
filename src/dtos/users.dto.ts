import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public fullName: string;

  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  public phone: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  public fullName: string;

  @IsPhoneNumber('UZ')
  @IsOptional()
  public phone: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsOptional()
  public oldPassword: string;

  @IsString()
  @IsOptional()
  public file: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  public password: string;
}
