import { Account } from '@prisma/client';
import accountRepository from 'repositories/account.repository';
import { DB_GENERATED_FIELDS } from 'repositories/base.repository';
import { HttpError } from 'errors/HttpError';

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
    await this.ensureUniqueName(account.name, account.userId);

    return accountRepository.create(account);
  }

  async update(accountId: string, updateData: Partial<Account>): Promise<Account | undefined> {
    const existingAccount = await accountRepository.findById(accountId);
    if (!existingAccount) {
      throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${accountId}`);
    }

    // check for duplicates if name is being updated
    if (updateData.name && updateData.name !== existingAccount.name) {
      await this.ensureUniqueName(updateData.name, existingAccount.userId, existingAccount.id);
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

  // utility to check for duplicate account names for a user
  private async ensureUniqueName(name: string, userId: string, excludeId?: string) {
    const existingAccount = await accountRepository.findByName(name, userId);
    if (existingAccount && existingAccount.id !== excludeId) {
      throw new HttpError(400, ERROR_MESSAGES.ACCOUNT_NAME_EXISTS);
    }
  }
}

export default new AccountService();
