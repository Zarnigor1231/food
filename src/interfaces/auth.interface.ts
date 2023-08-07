import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  _id?: string;
  email?: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface OtpData {
  code?: number;
  email?: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface PassRecovery {
  code?: number;
  email?: string;
  password: string;
}
