import { prismaClient}  from './client';

async function main() {
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prismaClient.$disconnect();
});
