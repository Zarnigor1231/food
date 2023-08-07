import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../shared/orders.enum';
import { CreateSavedLocationDto } from './saved-location.dto';

class ProductIdsDto {
  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

class PersonalInformation {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNumber()
  phoneNumber: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  shopId: string;

  @ValidateNested({ each: true })
  @Type(() => ProductIdsDto)
  @ApiProperty({ type: [ProductIdsDto] })
  productIds: ProductIdsDto[];

  @ApiProperty()
  @IsBoolean()
  isDelivery: boolean;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PersonalInformation)
  @ApiProperty({ type: PersonalInformation })
  personalInformation: PersonalInformation;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postcard: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  someInformation: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  preparationTime: number;

  @ApiProperty()
  @IsDateString()
  deliveryTime: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  savedLocationId: string;

  @ApiProperty({ type: CreateSavedLocationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSavedLocationDto)
  savedLocation: CreateSavedLocationDto;
}
