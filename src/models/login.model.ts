import { Login } from '@/interfaces/auth.interface';
import { model, Schema, Document } from 'mongoose';

const LoginSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const LoginModel = model<Login & Document>('Login', LoginSchema);
