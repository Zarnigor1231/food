export interface Product {
  _id: string;
  name: string;
  price: number;
  files: string[];
  delivryInfo: string;
  description?: string;
  category: string;
  favorites: number;
  createdAt: Date;
  updatedAt: Date;
}
