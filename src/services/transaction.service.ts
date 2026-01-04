import { Transaction } from '@prisma/client';
import transactionRepository from 'repositories/transaction.repository';
import { DB_GENERATED_FIELDS } from 'repositories/base.repository';
import { HttpError } from 'errors/HttpError';
import { TransactionCreateInput } from 'types/transaction';

const ERROR_MESSAGES = {
    ID_NOT_FOUND: 'Could not find transaction with given id: ',
  };

class TransactionService {
  async findByAccount(accountId: string, startDate: Date = new Date(0), endDate: Date = new Date()): Promise<Transaction[]> {
    return transactionRepository.findByAccountAndDateRange(accountId, startDate, endDate);
  }

  async bulkInsertFromStaged(accountId: string, inputTransactions: TransactionCreateInput[]) {
    if (!inputTransactions || !inputTransactions.length) return { count: 0 };
    const createInputs = inputTransactions.map(st => ({
      accountId,
      amount: st.amount,
      date: st.date,
      description: st.description,
      originalDescription: st.originalDescription,
      categoryId: st.categoryId,
    }));
    return transactionRepository.createMany(createInputs);
  }

  // standard CRUD
  async create(transaction: Omit<Transaction, DB_GENERATED_FIELDS>): Promise<Transaction> {        
    return transactionRepository.create(transaction);
  }
  
  async getAll(): Promise<Transaction[]> {
    return transactionRepository.findAll();
  }

  async findById(transactionId: string): Promise<Transaction | null> {
    return transactionRepository.findById(transactionId);
  }

  async update(transactionId: string, updateData: Partial<Transaction>): Promise<Transaction | undefined> {
    const existingTransaction = await transactionRepository.findById(transactionId);
    if (!existingTransaction) {
      throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${transactionId}`);
    }

    return transactionRepository.update(transactionId, updateData);
  }

  async delete(transactionId: string): Promise<Transaction | undefined> {
    const existing = await transactionRepository.findById(transactionId);
    if (!existing) {
      throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${transactionId}`);
    }

    return transactionRepository.remove(transactionId);
  }
}

export default new TransactionService();
