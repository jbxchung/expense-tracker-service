import { Category } from '@prisma/client';
import { DB_GENERATED_FIELDS } from '../repositories/base.repository';
import categoryRepository from '../repositories/category.repository';
import { CategoryTree } from '../types/category';
import { buildCategoryTree, traverseAndUpsertCategories } from '../utils/category.util';

class CategoryService {
  // return categories for a given user (globals + their own) as a tree structure
  async getCategoryTree(userId: string): Promise<CategoryTree[]> {
    const categories = await categoryRepository.findByUserId(userId, true);

    return buildCategoryTree(categories);
  }

  // flatten a nested category tree and upserts categories
  async saveCategoryTree(userId: string, tree: CategoryTree[]): Promise<CategoryTree[]> {
    // get all existing categories up front to reduce db calls
    const existingCategories = await categoryRepository.findByUserId(userId, true);
    const existingMap = new Map(existingCategories.map(cat => [cat.id, cat]));

    // walk the tree and upsert categories
    const flatCategories = await traverseAndUpsertCategories(tree, null, existingMap);

    // rebuild the tree to return the updated structure
    return buildCategoryTree(flatCategories);
  }

  // -----------------
  // Raw Category CRUD
  // -----------------

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
