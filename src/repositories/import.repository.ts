// repositories/import.repository.ts
import { prismaClient } from 'prisma/client';
import BaseRepository from './base.repository';

class ImportRepository extends BaseRepository<typeof prismaClient.import> {
  constructor() {
    super(prismaClient.import);
  }

  async createImport(data: {
    accountId: string;
    fileName?: string;
    importerId?: string;
    transactionCount: number;
  }) {
    return this.model.create({ data });
  }

  async findByAccount(accountId: string) {
    return this.model.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      include: { importer: true },
    });
  }
}

export default new ImportRepository();
