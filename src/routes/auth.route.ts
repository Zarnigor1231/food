import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { ConfirmOtpDto, GenerateOtpByEmailDto } from '@/dtos/otp.dto';
import { PassRecoveryDto } from '@/dtos/pass.recovery.dto';
import { LoginAdminDto } from '@/dtos/admins.dto';

export class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, ValidationMiddleware(CreateUserDto, 'body'), this.auth.signUp);
    this.router.post(`${this.path}generateOtpByEmail`, ValidationMiddleware(GenerateOtpByEmailDto, 'body'), this.auth.generateOtpByEmail);
    this.router.post(`${this.path}confirmOtp`, ValidationMiddleware(ConfirmOtpDto, 'body'), this.auth.confirmOtp);
    this.router.post(`${this.path}generatePassRecovery`, ValidationMiddleware(GenerateOtpByEmailDto, 'body'), this.auth.generatePassRecovery);
    this.router.post(`${this.path}passRecovery`, ValidationMiddleware(PassRecoveryDto, 'body'), this.auth.passRecovery);
    this.router.post(`${this.path}login`, ValidationMiddleware(LoginUserDto, 'body'), this.auth.logIn);
    this.router.post(`${this.path}login-admin`, ValidationMiddleware(LoginAdminDto, 'body'), this.auth.loginForAdmin);
    this.router.post(`${this.path}logout`, AuthMiddleware, this.auth.logOut);
  }
}
