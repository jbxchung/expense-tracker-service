import { AccountType, Prisma } from '@prisma/client';
import { prismaClient } from 'prisma/client';
import BaseRepository from './base.repository';

class AccountRepository extends BaseRepository<Prisma.AccountDelegate> {
  constructor() {
    super(prismaClient.account);
  }

  async findByUserId(userId: string) {
    return this.model.findMany({
      where: { userId },
      include: {
        imports: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { importer: true },
        },
      },
    });
  }

  async findByName(name: string, userId?: string) {
    return this.model.findFirst({
      where: {
        name: name,
        ...(userId ? { userId } : {}),
      }
    });
  }

  async findByType(userId: string, type: AccountType) {
    return this.model.findMany({
      where: {
        userId,
        type,
      },
    });
  }
}

export default new AccountRepository();
