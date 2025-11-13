import { Prisma } from '@prisma/client';
import { prismaClient } from '../prisma/client';
import BaseRepository from './base.repository';

class UserRepository extends BaseRepository<Prisma.CategoryDelegate> {
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

    return this.model.findMany({ where });
  }

  async findByName(name: string, userId?: string) {
    return this.model.findFirst({ where: { name, userId: userId || null } });
  }
}

export default new UserRepository();
