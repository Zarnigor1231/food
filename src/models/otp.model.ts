import { model, Schema, Document } from 'mongoose';
import { Otp } from '@interfaces/otp.interface';

const OtpSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

OtpSchema.index({ email: 1, code: 1 }, { unique: true, background: true });
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

export const OtpModel = model<Otp & Document>('Otp', OtpSchema);
