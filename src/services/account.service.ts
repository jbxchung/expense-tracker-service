import { Account } from '@prisma/client';
import accountRepository from '../repositories/account.repository';
import { DB_GENERATED_FIELDS } from '../repositories/base.repository';
import { HttpError } from '../errors/HttpError';

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
            throw new HttpError(400, 'Account with this name already exists');
        }

        return accountRepository.create(account);
    }

    async update(accountId: string, updateData: Partial<Account>): Promise<Account | undefined> {
        const existing = await accountRepository.findById(accountId);
        if (!existing) {
            throw new Error(`Could not find account to update: ${accountId}`);
        }

        return accountRepository.update(accountId, updateData);
    }

    async delete(accountId: string): Promise<Account | undefined> {
        const existing = await accountRepository.findById(accountId);
        if (!existing) {
            throw new Error(`Could not find account to delete: ${accountId}`);
        }

        return accountRepository.remove(accountId);
    }
}

export default new AccountService();
