import { Request } from 'express';
import { Transaction } from '@prisma/client';
import transactionService from '../services/transaction.service';
import { ApiResponse } from '../types/api-response';
import { HttpError } from '../errors/HttpError';

class TransactionController {
  async getTransactions(req: Request): Promise<ApiResponse<Transaction[]>> {
    const { accountId, from, to } = req.query;

    if (!accountId) {
      throw new HttpError(400, 'At least one accountId is required');
    }

    const accountIds = Array.isArray(accountId) ? accountId : [accountId];

    const startDate = from ? new Date(Number(from)) : undefined;
    const endDate = to ? new Date(Number(to)) : undefined;

    const results = await Promise.all(accountIds.map(id => (
      transactionService.findByAccount(id as string, startDate, endDate)
    )));

    return {
      success: true,
      message: `Retrieved transactions from for accounts ${accountIds} from ${
        startDate?.toLocaleString() ?? 'the beginning of Unix time'
      } to ${
        endDate?.toLocaleString() ?? 'now'
      }`,
      data: results.flat(),
    };
  };
  
  
  async createTransaction(req: Request): Promise<ApiResponse<Transaction>> {
    const newTransaction: Transaction = await transactionService.create(req.body);
    return { success: true, message: 'Created Transaction', data: newTransaction };
  };
  
  async updateTransaction(req: Request): Promise<ApiResponse<Transaction>> {
    const id = req.params.id || '';
    const Transaction = await transactionService.findById(id);
    if (!Transaction) {
      throw new HttpError(404, 'Transaction not found');
    }

    const updatedTransaction = await transactionService.update(id, req.body);
    return { success: true, message: 'Updated Transaction', data: updatedTransaction };
  };
  
  async deleteTransaction(req: Request): Promise<ApiResponse<Transaction>> {
    const id = req.params.id || '';
    const Transaction = await transactionService.findById(id);
    if (!Transaction) {
      throw new HttpError(404, 'Transaction not found');
    }

    const deletedTransaction = await transactionService.delete(id);
    return { success: true, message: 'Deleted Transaction', data: deletedTransaction };
  };
}

export default new TransactionController();
