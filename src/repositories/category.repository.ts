import { Prisma } from '@prisma/client';
import { prismaClient } from '../prisma/client';
import BaseRepository from './base.repository';

class CategoryRepository extends BaseRepository<Prisma.CategoryDelegate> {
  constructor() {
    super(prismaClient.category);
  }

  // find categories with no user id
  async findGlobal() {
    return this.model.findMany({ where: { userId: null } });
  }

  // find categories scoped to a given user
  async findByUserId(userId: string, includeGlobal = false) {
    const where = includeGlobal
    ? { OR: [{ userId }, { userId: null }] }
    : { userId };

    const rows = await this.model.findMany({
      where,
      include: {
        _count: {
          select: { transactions: true },
        }
      }
    });

    // return categories with an extra transactionCount field instead of the _count object
    return rows.map(({ _count, ...category }) => ({
      ...category,
      transactionCount: _count.transactions,
    }));
  }

  async findByName(name: string, userId?: string) {
    return this.model.findFirst({ where: { name, userId: userId || null } });
  }
}

export default new CategoryRepository();
