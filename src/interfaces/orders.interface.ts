export interface Order {
  _id: string;
  userID: string;
  products: { productID: string; count: number }[];
  totalSum: number;
}
