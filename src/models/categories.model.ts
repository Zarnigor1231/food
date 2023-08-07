import { model, Schema, Document } from 'mongoose';
import { Category } from '../interfaces/categories.interface';

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export const CategoryModel = model<Category & Document>('Category', CategorySchema);
