import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { UserModel } from '@models/users.model';
import { AdminModel } from '@/models/admins.model';

export const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = (roles: string[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const Authorization = getAuthorization(req);

      if (Authorization) {
        const { email } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;

        let findUser;

        if (roles.includes('amdin')) {
          findUser = await AdminModel.findOne({ email });

          if (!findUser) {
            return res.status(403).json({
              message: 'You do not have administrator rights',
            });
          }
        } else if (roles.includes('user')) {
          findUser = await UserModel.findOne({ email });

          if (!findUser) {
            return res.status(403).json({
              message: 'You do not have user rights',
            });
          }
          res.locals.user = findUser;
        }

        if (findUser) {
          req.user = findUser;
          next();
        } else {
          next(new HttpException(401, 'Wrong authentication token'));
        }
      } else {
        next(new HttpException(404, 'Authentication token missing'));
      }
    } catch (error) {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  };
};
