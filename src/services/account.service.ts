import { Account } from '@prisma/client';
import accountRepository from '../repositories/account.repository';
import { DB_GENERATED_FIELDS } from '../repositories/base.repository';
import { HttpError } from '../errors/HttpError';

const ERROR_MESSAGES = {
  ID_NOT_FOUND: 'Could not find account with given id: ',
  ACCOUNT_NAME_EXISTS: 'Account with this name already exists',
};

class AccountService {
  async getAll(): Promise<Account[]> {
    return accountRepository.findAll();
  }

  async findById(accountId: string): Promise<Account | null> {
    return accountRepository.findById(accountId);
  }

  async findByName(accountName: string, userId?: string): Promise<Account | null> {
    return accountRepository.findByName(accountName, userId);
  }

  async findByUserId(userId: string): Promise<Account[] | null> {
    return accountRepository.findByUserId(userId);
  }
  
  async create(account: Omit<Account, DB_GENERATED_FIELDS>): Promise<Account> {        
    const existingAccount = await accountRepository.findByName(account.name, account.userId);
    if (existingAccount) {
      throw new HttpError(400, ERROR_MESSAGES.ACCOUNT_NAME_EXISTS);
    }

    return accountRepository.create(account);
  }

  async update(accountId: string, updateData: Partial<Account>): Promise<Account | undefined> {
    const existing = await accountRepository.findById(accountId);
    if (!existing) {
      throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${accountId}`);
    }

    if (updateData.name && updateData.name !== existing.name) {
      const duplicate = await accountRepository.findByName(updateData.name, existing.userId);
      if (duplicate) {
        throw new HttpError(400, ERROR_MESSAGES.ACCOUNT_NAME_EXISTS);
      }
    }

    return accountRepository.update(accountId, updateData);
  }

  async delete(accountId: string): Promise<Account | undefined> {
    const existing = await accountRepository.findById(accountId);
    if (!existing) {
      throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${accountId}`);
    }

    return accountRepository.remove(accountId);
  }
}

export default new AccountService();
