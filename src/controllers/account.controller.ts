import { Request, Response, NextFunction } from 'express';
import { Account } from '@prisma/client';
import accountService from '../services/account.service';
import { ApiResponse } from '../types/api-response';
import { HttpError } from '../errors/HttpError';

class AccountController {
  async getAccounts(req: Request): Promise<ApiResponse<Account[]>> {
    const { userId } = req.query;
    const accounts = userId
      ? await accountService.findByUserId(userId as string) || []
      : await accountService.getAll();

    return { success: true, message: `Retrieved all accounts for user ${userId}`, data: accounts };
  };
  
  async getAccountById(req: Request): Promise<ApiResponse<Account>> {
    const id = req.params.id || '';
    const account = await accountService.findById(id);
    if (!account) {
      throw new HttpError(404, 'Account not found');
    }
    return { success: true, message: 'Retrieved account', data: account };
  };
  
  async createAccount(req: Request): Promise<ApiResponse<Account>> {
    const { userId, name, type } = req.body;
    const newAccount: Account = await accountService.create({ userId, name, type });
    return { success: true, message: 'Created account', data: newAccount };
  };
  
  async updateAccount(req: Request): Promise<ApiResponse<Account>> {
    const id = req.params.id || '';
    const account = await accountService.findById(id);
    if (!account) {
      throw new HttpError(404, 'Account not found');
    }

    const updatedAccount = await accountService.update(id, req.body);
    return { success: true, message: 'Updated account', data: updatedAccount };
  };
  
  async deleteAccount(req: Request): Promise<ApiResponse<Account>> {
    const id = req.params.id || '';
    const account = await accountService.findById(id);
    if (!account) {
      throw new HttpError(404, 'Account not found');
    }

    const deletedAccount = await accountService.delete(id);
    return { success: true, message: 'Deleted account', data: deletedAccount };
  };
}

export default new AccountController();
