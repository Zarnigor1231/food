import { IsNotEmpty, IsString } from 'class-validator';

export class FavoriteDto {
  @IsString()
  @IsNotEmpty()
  public productID: string;
}
