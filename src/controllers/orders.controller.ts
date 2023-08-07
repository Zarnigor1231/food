import { Order } from '@/interfaces/orders.interface';
import { OrdersService } from '@/services/orders.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class OrdersController {
  public orders = Container.get(OrdersService);

  // public getOrders = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const findAllOrderssData: Order[] = await this.orders.findAllOrders();

  //     res.status(200).json({ data: findAllOrderssData, message: 'findAll' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      const findOneOrdersData: Order = await this.orders.findOrders(user._id);

      res.status(200).json({ data: findOneOrdersData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ordersData: Order = req.body;
      const user = res.locals.user;

      const createOrdersData: Order = await this.orders.createOrders(ordersData, user._id);
      res.status(201).json({ data: createOrdersData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ordersId: string = req.params.id;
      const ordersData: Order = req.body;
      const user = res.locals.user;

      const updateOrdersData: Order = await this.orders.updateOrders(ordersId, ordersData, user._id);

      res.status(200).json({ data: updateOrdersData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ordersId: string = req.params.id;
      const user = res.locals.user;

      const deleteOrdersData: Order = await this.orders.deleteOrders(ordersId, user._id);

      res.status(200).json({ data: deleteOrdersData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
