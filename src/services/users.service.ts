import { compare, hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserModel.find().select({ _id: -1, fullName: 1, email: 1, phone: 1, file: 1 });

    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await UserModel.findOne({ _id: userId }).select({ _id: -1, fullName: 1, email: 1, phone: 1, file: 1 });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async updateUser(userId: string, userData: User, file: any): Promise<User> {
    if (userData.email) {
      const findUser: User = await UserModel.findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.oldPassword && userData.password) {
      const findUserId: User = await UserModel.findById({ _id: userId });

      const isPasswordMatching: boolean = await compare(userData.oldPassword, findUserId.password);
      if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

      const hashedPassword = await hash(userData.password, 10);
      userData.password = hashedPassword;
    }

    if (file) {
      let imgPath = `/images/${file.originalname}`;
      imgPath = imgPath.replace(/\s/g, '');

      const sharpFile = await sharp(file.buffer).resize({ width: 250, height: 250 }).png();
      writeFile(path.join(__dirname, `../upload`, imgPath), sharpFile);

      userData.file = imgPath;
    }

    const updateUserById: User = await UserModel.findByIdAndUpdate(new Object(userId), { ...userData }, { new: true });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await UserModel.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }
}
