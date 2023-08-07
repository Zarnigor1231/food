import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, IsOptional } from 'class-validator';

export class CreateAdminDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  public email: string;

  @IsString()
  @IsOptional()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class LoginAdminDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  public password: string;
}
