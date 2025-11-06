import { Account, AccountType } from '@prisma/client';
import { Service } from './service.interface';
import accountRepository from '../repositories/account.repository';

class AccountService implements Service {

    async initialize(): Promise<void> {
    }

    async getAll(): Promise<Account[]> {
        return accountRepository.findAll();
    }

    async findById(accountId: string): Promise<Account | null> {
        return accountRepository.findById(accountId);
    }

    async findByName(accountName: string, userId?: string): Promise<Account | null> {
        return accountRepository.findByName(accountName, userId);
    }
    
    async create(userId: string, accountName: string, accountType: AccountType): Promise<Account> {        
        const existing = await accountRepository.findByName(accountName);
        if (existing) {
            throw new Error('Account with this name already exists');
        }

        return accountRepository.create({
            userId: userId,
            name: accountName,
            type: accountType
        });
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
