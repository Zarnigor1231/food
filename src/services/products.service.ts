import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { ProductModel } from '@/models/products.model';
import { Product } from '@/interfaces/products.interface';
import { writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';

@Service()
export class ProductService {
  public async findAllProduct(): Promise<Product[]> {
    const products: Product[] = await ProductModel.find().select({ name: 1, price: 1, files: 1, favorites: 1 }).populate('category');
    return products;
  }

  public async findProductById(productId: string): Promise<Product> {
    const findProduct: Product = await ProductModel.findOne({ _id: productId }).select({ name: 1, price: 1, files: 1, favorites: 1 });
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    return findProduct;
  }

  public async createProduct(productData: Product, files: Express.Multer.File[]): Promise<Product> {
    const findProduct: Product = await ProductModel.findOne({ name: productData.name });
    if (findProduct) throw new HttpException(409, `This name ${productData.name} already exists`);
    const filesArr = [];

    if (files) {
      for (const file of files) {
        let imgPath = `/images/${Date.now()}${file.originalname}`;
        imgPath = imgPath.replace(/\s/g, '');

        const sharpFile = await sharp(file.buffer).resize({ width: 250, height: 250 }).png();
        writeFile(path.join(__dirname, `../upload`, imgPath), sharpFile);

        filesArr.push(imgPath);
      }
    }

    const createProductData: Product = await ProductModel.create({ ...productData, files: filesArr });

    return createProductData;
  }

  public async updateProduct(productId: string, productData: Product, files?: Express.Multer.File[]): Promise<Product> {
    const findProduct = await ProductModel.findOne({ _id: productId });
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");
    const filesDelete = findProduct?.files;

    if (files && filesDelete) {
      const directoryPath = path.join(__dirname, '../upload');

      const fsPromise = [];
      for (const file of findProduct.files) {
        if (!Array.isArray(productData.files)) {
          fsPromise.push(fs.unlink(directoryPath + file));
        } else if (!productData.files.includes(file)) {
          fsPromise.push(fs.unlink(directoryPath + file));
        }
      }

      await Promise.all(fsPromise);
    }

    if (files) {
      productData.files = Array.isArray(productData.files) ? productData.files : [];

      for (const file of files) {
        let imgPath = `/images/${Date.now()}${file.originalname}`;
        imgPath = imgPath.replace(/\s/g, '');

        const sharpFile = await sharp(file.buffer).resize({ width: 250, height: 250 }).png();
        writeFile(path.join(__dirname, `../upload`, imgPath), sharpFile);

        productData.files.push(imgPath);
      }
    }

    if (productData.name) {
      const findProduct: Product = await ProductModel.findOne({ name: productData.name });
      if (findProduct && findProduct?._id != productId) throw new HttpException(409, `This name ${productData.name} already exists`);
    }
    const updateProductById: Product = await ProductModel.findByIdAndUpdate(new Object(productId), productData, { new: true });

    return updateProductById;
  }

  public async deleteProduct(productId: string): Promise<Product> {
    const deleteProductFiles = await ProductModel.findById({ _id: productId });
    const files = deleteProductFiles?.files;

    const deleteProductById: Product = await ProductModel.findByIdAndDelete(productId);
    if (!deleteProductById) throw new HttpException(409, "Product doesn't exist");

    if (files) {
      const directoryPath = path.join(__dirname, '../upload');

      const fsPromise = [];
      for (const file of files) {
        fsPromise.push(fs.unlink(directoryPath + file));
      }

      await Promise.all(fsPromise);
    }

    return deleteProductById;
  }
}
