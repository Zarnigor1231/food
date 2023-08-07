import { IsArray, IsMongoId, IsNumber, IsOptional, ValidateIf, ValidateNested } from 'class-validator';

export class CreateOrdertDto {
  @IsArray()
  @IsOptional()
  public products: [object];
}

export class UpdateOrdertDto {
  @IsArray()
  @IsOptional()
  public products: [object];
}
