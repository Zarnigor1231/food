import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CategoryService } from '@/services/categories.service';
import { Category } from '@/interfaces/categories.interface';

export class CategoryController {
  public category = Container.get(CategoryService);

  public getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCategorysData: Category[] = await this.category.findAllCategory();

      res.status(200).json({ data: findAllCategorysData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId: string = req.params.id;
      const findOneCategoryData: Category = await this.category.findCategoryById(categoryId);

      res.status(200).json({ data: findOneCategoryData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData: Category = req.body;

      const createCategoryData: Category = await this.category.createCategory(categoryData);
      res.status(201).json({ data: createCategoryData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId: string = req.params.id;
      const categoryData: Category = req.body;

      const updateCategoryData: Category = await this.category.updateCategory(categoryId, categoryData);

      res.status(200).json({ data: updateCategoryData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId: string = req.params.id;
      const deleteCategoryData: Category = await this.category.deleteCategory(categoryId);

      res.status(200).json({ data: deleteCategoryData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
