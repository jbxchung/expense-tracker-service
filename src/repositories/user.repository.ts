import { Prisma } from '@prisma/client';
import { prismaClient } from 'prisma/client';
import BaseRepository from './base.repository';

class UserRepository extends BaseRepository<Prisma.UserDelegate> {
  constructor() {
    super(prismaClient.user);
  }

  async findByEmail(email: string) {
    return this.model.findFirst({ where: { email } });
  }

  async findByName(name: string) {
    return this.model.findMany({ where: { name: name } });
  }

  async getCount() {
    return this.model.count();
  }
}

export default new UserRepository();
