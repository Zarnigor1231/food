import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AdminController } from '@/controllers/admins.controller';
import { CreateAdminDto, UpdateAdminDto } from '@/dtos/admins.dto';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class AdminRoute implements Routes {
  public path = '/admin';
  public router = Router();
  public admin = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware(['admin']), this.admin.getAdmins);
    this.router.get(`${this.path}/:id`, AuthMiddleware(['admin']), this.admin.getAdminById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateAdminDto, 'body'), this.admin.createAdmin);
    this.router.put(`${this.path}/:id`, AuthMiddleware(['admin']), ValidationMiddleware(UpdateAdminDto, 'body', true), this.admin.updateAdmin);
    this.router.delete(`${this.path}/:id`, AuthMiddleware(['admin']), this.admin.deleteAdmin);
  }
}
