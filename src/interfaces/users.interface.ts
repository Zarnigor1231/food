export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: number;
  password: string;
  oldPassword: string;
  file?: string;
  createdAt: Date;
  updatedAt: Date;
}
