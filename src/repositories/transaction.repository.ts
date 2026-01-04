import { Prisma, Transaction } from '@prisma/client';
import { prismaClient } from 'prisma/client';
import BaseRepository, { DB_GENERATED_FIELDS } from './base.repository';

class TransactionRepository extends BaseRepository<typeof prismaClient.transaction> {
  constructor() {
    super(prismaClient.transaction);
  }

  // get all transactions for the given account
  async findByAccountId(accountId: string): Promise<Transaction[]> {
    return this.model.findMany({
      where: { accountId },
      orderBy: { date: 'desc' },
    });
  }

  // get transactions for the given account within specified date range
  async findByAccountAndDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return this.model.findMany({
      where: {
        accountId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async createMany(
    data: Omit<Transaction, DB_GENERATED_FIELDS>[]
  ): Promise<Prisma.BatchPayload> {
    return this.model.createMany({ data });
  }

  async upsertMany(
    data: Omit<Transaction, DB_GENERATED_FIELDS & { id: string; }>[]
  ): Promise<void> {
    await prismaClient.$transaction(
      data.map((t) =>
        this.model.upsert({
          where: { id: t.id },
          create: t,
          update: t,
        })
      )
    );
  }
}

export default new TransactionRepository();
