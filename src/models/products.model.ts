import { Product } from '@/interfaces/products.interface';
import { model, Schema, Document } from 'mongoose';

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    files: {
      type: [String],
      required: true,
    },
    delivryInfo: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      required: true,
      ref: 'Category',
    },
    favorites: {
      type: Number,
    },

  },
  { timestamps: true },
);

export const ProductModel = model<Product & Document>('Product', ProductSchema);
