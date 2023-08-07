import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { upload } from '../config/multer.config';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(['user']), this.user.getUsers);
    this.router.get(`${this.path}/:id`, AuthMiddleware(['user']), this.user.getUserById);
    this.router.put(
      `${this.path}/:id`,
      AuthMiddleware(['user']),
      upload.single('upload'),
      ValidationMiddleware(UpdateUserDto, 'body', true),
      this.user.updateUser,
    );
    this.router.delete(`${this.path}/:id`, AuthMiddleware(['user']), this.user.deleteUser);
  }
}
