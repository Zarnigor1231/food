import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { upload } from '../config/multer.config';
import { ProductController } from '@/controllers/products.controllers';
import { CreateProductDto, UpdateProductDto } from '@/dtos/products.dto';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class ProductRoute implements Routes {
  public path = '/products';
  public router = Router();
  public product = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.product.getProducts);
    this.router.get(`${this.path}/:id`, AuthMiddleware(['admin']), this.product.getProductById);
    this.router.post(
      `${this.path}`,
      AuthMiddleware(['admin']),
      upload.array('uploads', 4),
      ValidationMiddleware(CreateProductDto, 'body'),
      this.product.createProduct,
    );
    this.router.put(
      `${this.path}/:id`,
      AuthMiddleware(['admin']),
      upload.array('uploads'),
      ValidationMiddleware(UpdateProductDto, 'body', true),
      this.product.updateProduct,
    );
    this.router.delete(`${this.path}/:id`, AuthMiddleware(['admin']), this.product.deleteProduct);
  }
}
