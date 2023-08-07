import { Order } from '@/interfaces/orders.interface';
import { model, Schema, Document } from 'mongoose';

const OrderSchema: Schema = new Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    products: [
      {
        productID: {
          type: String,
          required: true,
          ref: 'Product',
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    totalSum: {
      type: Number,
    },
  },
  { timestamps: true },
);

export const OrdersModel = model<Order & Document>('Order', OrderSchema);
