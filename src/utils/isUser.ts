import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '@/interfaces/users.interface';
import { UserModel } from '@/models/users.model';

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

export const isUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getAuthorization(req);
    if (!token) {
      return res.status(403).json({
        message: 'You do not have token',
      });
    }

    const payload: roleConfig | any = jwt.verify(token, process.env.TOKEN_KEY || 'hey');

    const user = payload._doc;

    const findUser: User = await UserModel.findOne({ _id: user._id });

    if (!findUser) {
      return res.status(403).json({
        message: 'You do not have user rights',
      });
    }
    res.locals.user = findUser;

    next();
  } catch (error) {
    next(error);
  }
};
