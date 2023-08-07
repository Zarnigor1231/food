import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { Favorite } from '@/interfaces/favorites.interface';
import { FavoriteModel } from '@/models/favorites.model';
import { ProductModel } from '@/models/products.model';

@Service()
export class FavoriteService {
  public async findAllFavorite(): Promise<Favorite[]> {
    const favorites: Favorite[] = await FavoriteModel.find().populate([
      { path: 'userID', select: 'fullName' },
      { path: 'productID', select: 'name' },
    ]);
    return favorites;
  }

  public async createFavorite(favoriteData: Favorite, userID: any): Promise<Favorite> {
    const findFavorite: Favorite = await FavoriteModel.findOne({ userID });
    if (findFavorite) throw new HttpException(409, `You have a favorite`);

    const favoriteCount = await ProductModel.findOne({ _id: favoriteData.productID });
    favoriteCount.favorites++;

    await favoriteCount.save();

    const createFavoriteData: Favorite = await FavoriteModel.create({ ...favoriteData, userID });

    return createFavoriteData;
  }

  public async deleteFavorite(favoriteId: string, userID: any): Promise<Favorite> {
    const findFavorite: Favorite = await FavoriteModel.findOne({ _id: favoriteId });
    if (!findFavorite) throw new HttpException(409, "Favorite doesn't exist");

    if (findFavorite.userID == userID) {
      const deleteFavoriteById: Favorite = await FavoriteModel.findByIdAndDelete(favoriteId);

      const favoriteCount = await ProductModel.findOne({ _id: deleteFavoriteById.productID });
      favoriteCount.favorites--;

      await favoriteCount.save();

      return deleteFavoriteById;
    } else {
      throw new HttpException(409, 'you are not a valid user');
    }
  }
}
