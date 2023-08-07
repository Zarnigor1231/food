import { PassRecovery } from '@/interfaces/pass.recovery.interface';
import { model, Schema, Document } from 'mongoose';

const PassRecoverySchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true },
);

PassRecoverySchema.index({ email: 1, code: 1 }, { unique: true, background: true });
PassRecoverySchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

export const PassRecoveryModel = model<PassRecovery & Document>('PassRecovery', PassRecoverySchema);
