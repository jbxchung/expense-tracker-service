import { Request, Response, NextFunction } from 'express';
import { Account } from '@prisma/client';
// import { Account } from '../dao/account';
import accountService from '../services/account.service';


// Read all statements
export const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: Account[] = await accountService.getAll();

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Read single item
export const getAccountById = (req: Request, res: Response, next: NextFunction) => {
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


// Create an item
export const createAccount = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, name, type } = req.body;

    const newAccount: Account = await accountService.create(userId, name, type);

    res.status(201).json(newAccount);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
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