import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { AdminService } from '@/services/admins.service';
import { Admin } from '@/interfaces/admin.interface';

export class AdminController {
  public admin = Container.get(AdminService);

  public getAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllAdminsData: Admin[] = await this.admin.findAllAdmin();

      res.status(200).json({ data: findAllAdminsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getAdminById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId: string = req.params.id;
      const findOneAdminData: Admin = await this.admin.findAdminById(adminId);

      res.status(200).json({ data: findOneAdminData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminData: Admin = req.body;

      const { token, createAdminData } = await this.admin.createAdmin(adminData);

      res.setHeader('Set-Cookie', [token]);
      res.status(201).json({ data: { createAdminData, token }, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId: string = req.params.id;
      const adminData: Admin = req.body;

      const admin = res.locals.admin;

      const updateAdminData: Admin = await this.admin.updateAdmin(adminId, adminData, admin);

      res.status(200).json({ data: updateAdminData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId: string = req.params.id;
      const admin = res.locals.admin;

      const deleteAdminData: Admin = await this.admin.deleteAdmin(adminId, admin);

      res.status(200).json({ data: deleteAdminData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
