import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Admin } from '@/interfaces/admin.interface';
import { AdminModel } from '@/models/admins.model';

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

interface roleConfig {
  email: string;
}

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  let header = req.header('Authorization');
  if (header.startsWith('Bearer ')) {
    header = header.substring('Bearer '.length);
  }

  if (header) return header;

  return null;
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getAuthorization(req);
    if (!token) {
      return res.status(403).json({
        message: 'You do not have token',
      });
    }

    const payload: roleConfig | any = jwt.verify(token, process.env.TOKEN_KEY || 'hey');

    const admin = payload._doc;

    const findAdmin: Admin = await AdminModel.findOne({ email: admin?.email });

    if (!findAdmin) {
      return res.status(403).json({
        message: 'You do not have administrator rights',
      });
    }
    res.locals.admin = findAdmin;

    next();
  } catch (error) {
    next(error);
  }
};
