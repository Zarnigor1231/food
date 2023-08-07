import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const UserSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    address: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      unique: true,
      // validate: /^\+998([- ])?(90|91|93|94|95|98|99|33|97|71)([- ])?(\d{3})([- ])?(\d{2})([- ])?(\d{2})$/,
    },
    password: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
  },
  { timestamps: true },
);

export const UserModel = model<User & Document>('User', UserSchema);
