import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CategoryController } from '@/controllers/categories.controller';
import { CreateCategoryDto, UpdateCategoryDto } from '@/dtos/categories.dto';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class CategoryRoute implements Routes {
  public path = '/category';
  public router = Router();
  public categoty = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.categoty.getCategories);
    this.router.get(`${this.path}/:id`, AuthMiddleware(['admin']), this.categoty.getCategoryById);
    this.router.post(`${this.path}`, AuthMiddleware(['admin']), ValidationMiddleware(CreateCategoryDto, 'body'), this.categoty.createCategory);
    this.router.put(
      `${this.path}/:id`,
      AuthMiddleware(['admin']),
      ValidationMiddleware(UpdateCategoryDto, 'body', true),
      this.categoty.updateCategory,
    );
    this.router.delete(`${this.path}/:id`, AuthMiddleware(['admin']), this.categoty.deleteCategory);
  }
}
