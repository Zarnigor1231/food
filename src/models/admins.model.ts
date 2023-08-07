import { Admin } from '@/interfaces/admin.interface';
import { model, Schema, Document } from 'mongoose';

const AdminSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const AdminModel = model<Admin & Document>('Admin', AdminSchema);
