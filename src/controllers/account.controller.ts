import { Request, Response, NextFunction } from 'express';
import { Account } from '@prisma/client';
import accountService from '../services/account.service';

class AccountController {
  async getAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      let results: Account[] = [];
  
      if (!userId) {
        results = await accountService.getAll();
      } else {
        results = await accountService.findByUserId(userId as string) || [];
      }
  
      res.json(results);
    } catch (error) {
      next(error);
    }
  };
  
  // Read single item
  async getAccountById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id || '';
      const account = accountService.findById(id);
      if (!account) {
        res.status(404).json({ message: 'Account not found' });
        return;
      }
      res.json(account);
    } catch (error) {
      next(error);
    }
  };
  
  async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { userEmail, name, type } = req.body;
  
      const newAccount: Account = await accountService.create(userEmail, name, type);
  
      res.status(201).json(newAccount);
    } catch (error) {
      next(error);
    }
  };
  
  async updateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id || '';
  
      const updatedAccount = await accountService.update(id, req.body);
  
      res.json(updatedAccount);
    } catch (error) {
      next(error);
    }
  };
  
  async deleteAccount (req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id || '';
      const account = await accountService.findById(id);
      if (!account) {
        res.status(404).json({ message: 'Account not found' });
        return;
      }
  
      const deletedAccount = await accountService.delete(id);
      res.json(deletedAccount);
    } catch (error) {
      next(error);
    }
  };
}

export default new AccountController();
