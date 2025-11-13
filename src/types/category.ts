import { Category } from '@prisma/client';

// prisma generates our actual domain classes but we want to extend Category to be return a tree for the frontend
export interface CategoryTree extends Omit<Category, 'parentId'> {
  children: CategoryTree[];
}