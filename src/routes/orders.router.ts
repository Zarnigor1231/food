import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { OrdersController } from '@/controllers/orders.controller';
import { CreateOrdertDto, UpdateOrdertDto } from '@/dtos/orders.dto';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class OrderRoute implements Routes {
  public path = '/orders';
  public router = Router();
  public order = new OrdersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get(`${this.path}`, AuthMiddleware(['user']), this.order.getOrders);
    this.router.get(`${this.path}`, AuthMiddleware(['user']), this.order.getOrders);
    this.router.post(`${this.path}`, AuthMiddleware(['user']), ValidationMiddleware(CreateOrdertDto, 'body'), this.order.createOrders);
    this.router.put(`${this.path}/:id`, AuthMiddleware(['user']), ValidationMiddleware(UpdateOrdertDto, 'body', true), this.order.updateOrders);
    this.router.delete(`${this.path}/:id`, AuthMiddleware(['user']), this.order.deleteOrders);
  }
}
