import { Request, Response } from 'express';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import path from 'path';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class ImagesRouter implements Routes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/images/:file`, AuthMiddleware(['user']), (req: Request, res: Response) => {
      try {
        const { file } = req.params as any;
        return res.sendFile(path.join(process.cwd(), 'src', 'upload/images', file));
      } catch (error) {}
    });
  }
}
