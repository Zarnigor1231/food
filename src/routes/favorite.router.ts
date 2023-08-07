import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { FavoriteController } from '@/controllers/favorites.controllers';
import { FavoriteDto } from '@/dtos/favorite.dto';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class FavoriteRoute implements Routes {
  public path = '/favorite';
  public router = Router();
  public favorite = new FavoriteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.favorite.getFavorites);
    this.router.post(`${this.path}`, AuthMiddleware(['user']), ValidationMiddleware(FavoriteDto, 'body'), this.favorite.createFavorite);
    this.router.delete(`${this.path}/:id`, AuthMiddleware(['user']), this.favorite.deleteFavorite);
  }
}
