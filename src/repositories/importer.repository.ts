import { Prisma } from '@prisma/client';
import { prismaClient } from 'prisma/client';
import BaseRepository from './base.repository';

class ImporterRepository extends BaseRepository<Prisma.ImporterDelegate> {
  constructor() {
    super(prismaClient.importer);
  }

  // find importers with no user id
  async findGlobal() {
    return this.model.findMany({ where: { userId: null } });
  }

  // find importers scoped to a given user
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

export default new ImporterRepository();
