import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { Admin } from '@/interfaces/admin.interface';
import { AdminModel } from '@/models/admins.model';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import { sign } from 'jsonwebtoken';
import { TOKEN_KEY } from '@/config';
import { hash } from 'bcrypt';

const createToken = (admin: Admin): TokenData => {
  const dataStoredInToken: DataStoredInToken = admin;
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, TOKEN_KEY, { expiresIn }) };
};

@Service()
export class AdminService {
  public async findAllAdmin(): Promise<Admin[]> {
    const admins: Admin[] = await AdminModel.find();
    return admins;
  }

  public async findAdminById(AdminId: string): Promise<Admin> {
    const findAdmin: Admin = await AdminModel.findOne({ _id: AdminId });
    if (!findAdmin) throw new HttpException(409, "Admin doesn't exist");

    return findAdmin;
  }

  public async createAdmin(AdminData: Admin): Promise<{ token: string; createAdminData: Admin }> {
    const findAdmin: Admin = await AdminModel.findOne({ email: AdminData.email });
    if (findAdmin) throw new HttpException(409, `This email ${AdminData.email} already exists`);

    const hashedPassword = await hash(AdminData.password, 10);
    const createAdminData: Admin = await AdminModel.create({ ...AdminData, password: hashedPassword });

    const tokenData = createToken({ ...createAdminData } as Admin);
    const token = `${tokenData.token}`;

    return { token, createAdminData };
  }

  public async updateAdmin(AdminId: string, AdminData: Admin, Admin: any): Promise<Admin> {
    if (AdminId == Admin._id) {
      if (AdminData.email) {
        const findAdmin: Admin = await AdminModel.findOne({ email: AdminData.email });
        if (findAdmin && findAdmin._id != AdminId) throw new HttpException(409, `This email ${AdminData.email} already exists`);
      }

      if (AdminData.password) {
        const hashedPassword = await hash(AdminData.password, 10);
        AdminData = { ...AdminData, password: hashedPassword };
      }

      const updateAdminById: Admin = await AdminModel.findByIdAndUpdate(new Object(AdminId), AdminData, { new: true });
      if (!updateAdminById) throw new HttpException(409, "Admin doesn't exist");

      return updateAdminById;
    } else {
      throw new HttpException(409, 'You are not the required admin');
    }
  }

  public async deleteAdmin(AdminId: string, Admin: any): Promise<Admin> {
    if (AdminId == Admin._id) {
      const deleteAdminById: Admin = await AdminModel.findByIdAndDelete(AdminId);
      if (!deleteAdminById) throw new HttpException(409, "Admin doesn't exist");

      return deleteAdminById;
    } else {
      throw new HttpException(409, 'You are not the required admin');
    }
  }
}
