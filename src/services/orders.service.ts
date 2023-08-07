import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { OrdersModel } from '@/models/orders.model';
import { Order } from '@/interfaces/orders.interface';
import { ProductModel } from '@/models/products.model';
import { Product } from '@/interfaces/products.interface';

@Service()
export class OrdersService {
  // public async findAllOrders(): Promise<Order[]> {
  //   const orders: Order[] = await OrdersModel.find().populate('products');
  //   return orders;
  // }

  public async findOrders(userID: string): Promise<Order> {
    const findOrders: Order = await OrdersModel.findOne({ userID });
    if (!findOrders) throw new HttpException(409, "Order doesn't exist");

    return findOrders;
  }

  public async createOrders(ordersData: Order, userID: string): Promise<Order> {
    const product = ordersData.products;
    let totalSum = 0;
    for (const element of product) {
      const findProduct: Product = await ProductModel.findById({ _id: element.productID });
      if (!findProduct) throw new HttpException(409, `There are no product with ${ordersData.products} such`);

      totalSum += findProduct.price * element.count;
    }

    const products = { ...ordersData, totalSum, userID };
    const createOrdersData: Order = await OrdersModel.create(products);

    return createOrdersData;
  }

  public async updateOrders(ordersId: string, ordersData: Order, userID: string): Promise<Order> {
    const findOrders: Order = await OrdersModel.findOne({ _id: ordersId });
    if (findOrders.userID !== userID) throw new HttpException(409, `You cannot change the order`);

    const updateOrdersById: Order = await OrdersModel.findByIdAndUpdate(new Object(ordersId), { ...ordersData, userID }, { new: true });
    if (!updateOrdersById) throw new HttpException(409, "Order doesn't exist");

    return updateOrdersById;
  }

  public async deleteOrders(ordersId: string, userID: string): Promise<Order> {
    const findOrders: Order = await OrdersModel.findOne({ _id: ordersId });
    if (findOrders.userID !== userID) throw new HttpException(409, `You cannot delete the order`);

    const deleteOrdersById: Order = await OrdersModel.findByIdAndDelete(ordersId);
    if (!deleteOrdersById) throw new HttpException(409, "Order doesn't exist");

    return deleteOrdersById;
  }
}
