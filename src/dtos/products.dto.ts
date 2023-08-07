import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumberString()
  @IsNotEmpty()
  public price: number;

  @IsString()
  @IsNotEmpty()
  public delivryInfo: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public category: string;

  @IsString()
  @IsOptional()
  public files: string[];
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  public price: number;

  @IsString()
  @IsOptional()
  public delivryInfo: string;

  @IsString()
  @IsOptional()
  public description: string;

  @IsString()
  @IsOptional()
  public category: string;

  @IsString({ each: true })
  @IsOptional()
  @ValidateIf((obj, value) => {
    if (value) {
      obj.files = JSON.parse(value);
    }
    return true;
  })
  public files: string[];
}
