import { Category } from '@prisma/client';
import { DB_GENERATED_FIELDS } from 'repositories/base.repository';
import categoryRepository from 'repositories/category.repository';
import { CategoryTree } from 'types/category';
import { buildCategoryTree, traverseAndUpsertCategories } from 'utils/category.util';

class CategoryService {
  // return categories for a given user (globals + their own) as a tree structure
  async getCategoryTree(userId: string): Promise<CategoryTree[]> {
    const categories = await categoryRepository.findByUserId(userId);

    return buildCategoryTree(categories);
  }

  // flatten a nested category tree and upserts categories
  async saveCategoryTree(userId: string, tree: CategoryTree[]): Promise<CategoryTree[]> {
    // get all existing categories up front to reduce db calls
    const existingCategories = await categoryRepository.findByUserId(userId);
    const existingMap = new Map(existingCategories.map(cat => [cat.id, cat]));

    // walk the tree and upsert categories
    const flatCategories = await traverseAndUpsertCategories(tree, null, existingMap, userId);

    const seenIds = new Set(flatCategories.map(c => c.id));
    
    // delete categories that are no longer in the tree
    const categoriesToDelete = existingCategories.filter(c => !seenIds.has(c.id));
    for (const delCategory of categoriesToDelete) {
      await categoryRepository.deleteById(delCategory.id);
    }

    // rebuild the tree to return the updated structure
    return buildCategoryTree(flatCategories);
  }

  // -----------------
  // Raw Category CRUD
  // -----------------

  async findById(categoryId: string): Promise<Category | null> {
    return categoryRepository.findById(categoryId);
  }

  async findGlobal(): Promise<Category[]> {
    return categoryRepository.findDefaults();
  }

  async findByUserId(userId: string): Promise<Category[]> {
    return categoryRepository.findByUserId(userId);
  }

  async create(category: Omit<Category, DB_GENERATED_FIELDS>): Promise<Category> {
    const existingCategory = await categoryRepository.findByName(category.name, category.userId);
    if (existingCategory) {
      throw new Error('Category with this name already exists for user ' + category.userId);
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

  // bootstrap
  async createGlobalDefaults() {
    const existingCategories = await this.findGlobal();
    if (existingCategories.length > 0) {
      console.log('Default categories already exist, skipping seeding.');
      return;
    } else {
      const categories = [
        { name: 'Food', description: 'Expenses for food and dining', sortOrder: 0, parentId: null, userId: null },
        { name: 'Transportation', description: 'Expenses for transportation and travel', sortOrder: 1, parentId: null, userId: null },
        { name: 'Utilities', description: 'Expenses for utilities like electricity, water, etc.', sortOrder: 2, parentId: null, userId: null },
        { name: 'Entertainment', description: 'Expenses for entertainment and leisure activities', sortOrder: 3, parentId: null, userId: null },
        { name: 'Health', description: 'Expenses for health and medical needs', sortOrder: 4, parentId: null, userId: null },
      ];

      for (const category of categories) {
        await this.create(category);
      }
      console.log('Seed categories created');
    }
  }
}

export default new CategoryService();
