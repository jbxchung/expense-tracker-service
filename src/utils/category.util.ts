import { Category } from '@prisma/client';
import { CategoryTree } from 'types/category';
import categoryRepository from 'repositories/category.repository';

// controller validation
export function isCategoryTreeArray(obj: any): obj is CategoryTree[] {
  if (!Array.isArray(obj)) return false;

  return obj.every(node => {
    const hasValidProps =
      typeof node.name === 'string' && node.name.trim().length > 0 &&
      (node.id === undefined || typeof node.id === 'string') &&
      (node.description === undefined || typeof node.description === 'string') &&
      (node.parentId === null || typeof node.parentId === 'string');

    const childrenValid =
      node.children === undefined || isCategoryTreeArray(node.children);

    return hasValidProps && childrenValid;
  });
}

// build a tree from flat categories
export function buildCategoryTree(categories: Category[]): CategoryTree[] {
  const categoryMap = new Map<string, CategoryTree>(categories.map(c => [c.id, { ...c, children: [] }]));
  const tree: CategoryTree[] = [];

  for (const category of categories) {
    const node = categoryMap.get(category.id)!;

    // append to parent if it exists, otherwise its a root category
    category.parentId
    ? categoryMap.get(category.parentId)?.children!.push(node)
    : tree.push(node);
  }

  return sortCategoryTree(tree);
}

function sortCategoryTree(categoryTree: CategoryTree[]): CategoryTree[] {
  // sort this layer by sortOrder with fallback on name
  categoryTree.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    return a.name.localeCompare(b.name);
  });

  // recursively sort children
  for (const node of categoryTree) {
    if (node.children.length > 0) {
      node.children = sortCategoryTree(node.children);
    }
  }

  return categoryTree;
}

// traverse and upsert categories with existing map
export async function traverseAndUpsertCategories(
  nodes: CategoryTree[],
  parentId: string | null,
  existingMap: Map<string, Category>,
  userId: string,
): Promise<Category[]> {
  const results: Category[] = [];

  for (const node of nodes) {
    const { id, name, description, sortOrder, children } = node;

    let savedCategory: Category;

    if (id && existingMap.has(id)) {
      savedCategory = await categoryRepository.update(id, { name, description, parentId, sortOrder, userId });
    } else {
      savedCategory = await categoryRepository.create({ name, description, parentId, sortOrder, userId });
    }

    results.push(savedCategory);

    if (children?.length) {
      const childResults = await traverseAndUpsertCategories(children, savedCategory.id, existingMap, userId);
      results.push(...childResults);
    }
  }

  return results;
}
