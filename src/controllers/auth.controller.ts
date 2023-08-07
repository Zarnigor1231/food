import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { Otp } from '@/interfaces/otp.interface';
import { getAuthorization } from '@/middlewares/auth.middleware';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@/config';
import { HttpException } from '@/exceptions/httpException';
import { UserModel } from '@/models/users.model';
import { hash } from 'bcrypt';
import { Admin } from '@/interfaces/admin.interface';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getOtpToken = getAuthorization(req);

      if (!getOtpToken) {
        throw new HttpException(409, 'invalit token');
      }
      const { email } = verify(getOtpToken, SECRET_KEY) as DataStoredInToken;

      const userData: User = req.body;
      const imgPath = `/images/images.png`;
      userData.file = imgPath;

      const { createUserData, token } = await this.auth.signup({ ...userData, email });

      res.status(201).json({ data: { createUserData, token }, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { cookie, findUser } = await this.auth.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public generateOtpByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const otpData: Otp = req.body;
      const data = await this.auth.generateOtpByEmail(otpData);

      res.status(200).json({ data, message: 'Message sent to email' });
    } catch (error) {
      next(error);
    }
  };

  public confirmOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { cookie } = await this.auth.confirmOtp(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ message: 'completed successfully' });
    } catch (error) {
      next(error);
    }
  };

  public generatePassRecovery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const otpData: Otp = req.body;
      const data = await this.auth.generatePassRecovery(otpData);

      res.status(200).json({ data, message: 'generateOtpByEmail' });
    } catch (error) {
      next(error);
    }
  };

  public passRecovery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { password, email } = await this.auth.passRecovery(userData);

      const findUser: User = await UserModel.findOne({ email });

      if (password) {
        const hashedPassword = await hash(password, 10);

        const updateUserById: User = await UserModel.findByIdAndUpdate(
          new Object(findUser._id),
          { ...findUser, password: hashedPassword },
          { new: true },
        );

        if (!updateUserById) throw new HttpException(409, "User doesn't exist");

        res.status(200).json({ data: updateUserById, message: 'passRecovery' });
      }

      res.status(400).json({ message: 'You have not entered a password' });
    } catch (error) {
      next(error);
    }
  };

  public loginForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminData: Admin = req.body;
      const { cookie, findAdmin } = await this.auth.loginForAdmin(adminData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findAdmin, message: 'login' });
    } catch (error) {
      next(error);
    }
  };
}
