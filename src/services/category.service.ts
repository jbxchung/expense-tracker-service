import { Category } from '@prisma/client';
import { Service } from './service.interface';
import categoryRepository from '../repositories/category.repository';
import { DB_GENERATED_FIELDS } from '../repositories/base.repository';

class CategoryService implements Service {
  async initialize(): Promise<void> {
  }

  async findById(categoryId: string): Promise<Category | null> {
    return categoryRepository.findById(categoryId);
  }

  async findGlobal(): Promise<Category[] | null> {
    return categoryRepository.findGlobal();
  }

  async findByUserId(userId: string): Promise<Category[] | null> {
    return categoryRepository.findByUserId(userId);
  }

  async create(category: Omit<Category, DB_GENERATED_FIELDS>): Promise<Category> {
    const existingCategory = await categoryRepository.findByName(category.name, category.userId ?? undefined);
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }
    return categoryRepository.create(category);
  }

  async update(categoryId: string, updateData: Partial<Category>): Promise<Category | undefined> {
    const existing = await categoryRepository.findById(categoryId);
    if (!existing) {
      throw new Error(`Could not find category to update: ${categoryId}`);
    }

    return categoryRepository.update(categoryId, updateData);
  }

  async delete(categoryId: string): Promise<Category | undefined> {
    const existing = await categoryRepository.findById(categoryId);
    if (!existing) {
      throw new Error(`Could not find category to delete: ${categoryId}`);
    }

    return categoryRepository.remove(categoryId);
  }
}

export default new CategoryService();
