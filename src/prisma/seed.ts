import { Category } from '@prisma/client';
import { prismaClient}  from './client';


async function seedUser() {
  const existing = await prismaClient.user.findUnique({
    where: { email: 'brandon@jbxchung.dev' },
  });

  if (!existing) {
    await prismaClient.user.create({
      data: {
        email: 'brandon@jbxchung.dev',
        name: 'Brandon'
      },
    });
    console.log('Seed user created');
  } else {
    console.log('Seed user already exists');
  }
}

async function seedCategories() {
  const existingCategories = await prismaClient.category.findMany();
  if (existingCategories.length > 0) {
    console.log('Categories already exist, skipping seeding.');
    return;
  } else {
    const categories = [
      { name: 'Food', description: 'Expenses for food and dining', sortOrder: 0, userId: null },
      { name: 'Transportation', description: 'Expenses for transportation and travel', sortOrder: 1, userId: null },
      { name: 'Utilities', description: 'Expenses for utilities like electricity, water, etc.', sortOrder: 2, userId: null },
      { name: 'Entertainment', description: 'Expenses for entertainment and leisure activities', sortOrder: 3, userId: null },
      { name: 'Health', description: 'Expenses for health and medical needs', sortOrder: 4, userId: null },
    ];

    for (const category of categories) {
      await prismaClient.category.create({ data: category });
    }
    console.log('Seed categories created');
  }
}

async function main() {
  await seedUser();
  await seedCategories();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prismaClient.$disconnect();
});
