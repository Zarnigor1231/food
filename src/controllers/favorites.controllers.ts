import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { FavoriteService } from '@/services/favorite.service';
import { Favorite } from '@/interfaces/favorites.interface';

export class FavoriteController {
  public favorite = Container.get(FavoriteService);

  public getFavorites = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllFavoritesData: Favorite[] = await this.favorite.findAllFavorite();

      res.status(200).json({ data: findAllFavoritesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const favoriteData: Favorite = req.body;

      const user = res.locals.user;

      const createFavoriteData: Favorite = await this.favorite.createFavorite(favoriteData, user._id);
      res.status(201).json({ data: createFavoriteData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public deleteFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const favoriteId: string = req.params.id;
      const user = res.locals.user;

      const deleteFavoriteData: Favorite = await this.favorite.deleteFavorite(favoriteId, user._id);

      res.status(200).json({ data: deleteFavoriteData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
