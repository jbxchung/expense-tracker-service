import categoryService from '../services/category.service';
import userService from '../services/user.service';
import { prismaClient}  from './client';

async function seedCategories() {
  const existingCategories = await categoryService.findGlobal();
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
      await categoryService.create(category);
    }
    console.log('Seed categories created');
  }
}

async function seedUser() {
  const existing = await userService.findByEmail('brandon@jbxchung.dev');
  
  if (!existing) {
    await userService.create({ name: 'Brandon', email: 'brandon@jbxchung.dev'});
    console.log('Seed user created');
  } else {
    console.log('Seed user already exists');
  }
}

async function main() {
  await seedCategories();
  await seedUser();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prismaClient.$disconnect();
});
