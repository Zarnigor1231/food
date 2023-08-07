import { Favorite } from '@/interfaces/favorites.interface';
import { model, Schema, Document } from 'mongoose';

const FavoriteSchema: Schema = new Schema(
  {
    userID: {
      type: String,
      required: true,
      ref: 'User',
    },
    productID: {
      type: String,
      required: true,
      ref: 'Product',
    },
  },
  { timestamps: true },
);

export const FavoriteModel = model<Favorite & Document>('Favorite', FavoriteSchema);
