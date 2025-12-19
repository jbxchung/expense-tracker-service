import { Request } from 'express';
import { Category } from '@prisma/client';

import { ApiResponse } from '../types/api-response';
import { CategoryTree } from '../types/category';

import { HttpError } from '../errors/HttpError';
import categoryService from '../services/category.service';
import { isCategoryTreeArray } from '../utils/category.util';


class CategoryController {
  async getCategoryTree(req: Request): Promise<ApiResponse<CategoryTree[]>> {
    const { userId } = req.query;
    if (!userId) {
      throw new HttpError(400, 'userId query parameter is required');
    }

    const categoryTree = await categoryService.getCategoryTree(userId as string);
    return { success: true, message: `Retrieved category tree for user ${userId}`, data: categoryTree };
  }

  async saveCategoryTree(req: Request): Promise<ApiResponse<CategoryTree[]>> {
    const { userId } = req.query;
    if (!userId) {
      throw new HttpError(400, 'userId query parameter is required');
    }

    if (!isCategoryTreeArray(req.body)) {
      throw new HttpError(400, 'Invalid category tree format');
    }

    const categoryTree = await categoryService.saveCategoryTree(userId as string, req.body);
    return { success: true, message: `Saved category tree for user ${userId}`, data: categoryTree };
  }


  // return a raw list of the categories for a given user (globals + their own)
  async getCategories(req: Request): Promise<ApiResponse<Category[]>> {
    const { userId } = req.query;
    const categories = await categoryService.findGlobal() ?? [];
    
    let message = 'Retrieved all global categories';
    if (userId) {
      const userCategories = await categoryService.findByUserId(userId as string) ?? [];
      categories?.push(...userCategories);
      message = `Retrieved all categories for user ${userId}`
    }

    return { success: true, message, data: categories };
  };

  async createCategory(req: Request): Promise<ApiResponse<Category>> {
    const { name, description, userId, sortOrder, parentId } = req.body;
    const newCategory: Category = await categoryService.create({ name, description, userId, sortOrder, parentId });
    return { success: true, message: 'Created category', data: newCategory };
  };

  async updateCategory(req: Request): Promise<ApiResponse<Category>> {
    const categoryId = req.params.id || '';
    const category = await categoryService.findById(categoryId);
    if (!category) {
      throw new HttpError(404, 'Category not found');
    }

    const updatedCategory = await categoryService.update(categoryId, req.body);
    return { success: true, message: 'Updated category', data: updatedCategory };
  }

  async deleteCategory(req: Request): Promise<ApiResponse<Category>> {
    const categoryId = req.params.id || '';
    const category = await categoryService.findById(categoryId);
    if (!category) {
      throw new HttpError(404, 'Category not found');
    }

    const deletedCategory = await categoryService.delete(categoryId);
    return { success: true, message: 'Deleted category', data: deletedCategory };
  }
}

export default new CategoryController();
