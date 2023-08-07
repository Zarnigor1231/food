import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  public name: string;
}
