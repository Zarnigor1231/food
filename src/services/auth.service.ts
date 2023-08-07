import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY, TOKEN_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, OtpData, PassRecovery, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { OtpModel } from '@/models/otp.model';
import sendEmail from '@/utils/send.email';
import { PassRecoveryModel } from '@/models/pass.recovery';
import { Admin } from '@/interfaces/admin.interface';
import { AdminModel } from '@/models/admins.model';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = user;
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createTokenUser = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = user;
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, TOKEN_KEY, { expiresIn }) };
};

const createTokenAdmin = (admin: Admin): TokenData => {
  const dataStoredInToken: DataStoredInToken = admin;
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, TOKEN_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(userData: User): Promise<{ createUserData: User; token: string }> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword });

    const token = createTokenUser({ ...createUserData } as User).token;

    return { createUserData, token };
  }

  public async login(userData: User): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createToken({ email: findUser.email } as User);
    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await UserModel.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public async generateOtpByEmail(otpData: OtpData) {
    const findOtp = await OtpModel.findOne({ email: otpData.email });

    if (findOtp) {
      throw new HttpException(409, `This email ${otpData.email} has already exist`);
    }

    const code = Math.floor(1000 + Math.random() * 9000);

    await OtpModel.create({ email: otpData.email, code });

    await sendEmail(otpData.email, code);

    return { message: `Sent a verification code to this email ${otpData.email}` };
  }

  public async confirmOtp(otpData: OtpData) {
    const findOtp = await OtpModel.findOne({ email: otpData.email });

    if (!findOtp) {
      throw new HttpException(409, `This email ${otpData.email} has not found`);
    }

    if (otpData.code !== findOtp.code) {
      throw new HttpException(409, `This code ${otpData.code} incorrect`);
    }

    const tokenData = createToken({ email: findOtp.email } as User);
    const cookie = createCookie(tokenData);

    return { cookie };
  }

  public async generatePassRecovery(otpData: OtpData) {
    const findOtp = await UserModel.findOne({ email: otpData.email });

    if (!findOtp) {
      throw new HttpException(409, `${otpData.email} email is not registered`);
    }

    const code = Math.floor(1000 + Math.random() * 9000);

    await PassRecoveryModel.create({ email: otpData.email, code });

    await sendEmail(otpData.email, code);

    return { message: `Sent a verification code to this email ${otpData.email}` };
  }

  public async passRecovery(userData: PassRecovery) {
    const findOtp = await PassRecoveryModel.findOne({ email: userData.email });

    if (!findOtp) {
      throw new HttpException(409, `This email ${userData.email} has not found`);
    }

    if (userData.code !== findOtp.code) {
      throw new HttpException(409, `This code ${userData.code} incorrect`);
    }

    return userData;
  }

  public async loginForAdmin(adminData: Admin): Promise<{ cookie: string; findAdmin: Admin }> {
    const findAdmin: Admin = await AdminModel.findOne({ email: adminData.email });
    if (!findAdmin) throw new HttpException(409, `This email ${adminData.email} was not found`);

    const isPasswordMatching: boolean = await compare(adminData.password, findAdmin.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createTokenAdmin({ email: findAdmin.email } as Admin);
    const cookie = createCookie(tokenData);

    return { cookie, findAdmin };
  }
}
