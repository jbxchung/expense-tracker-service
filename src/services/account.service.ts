import { Account, AccountType } from '@prisma/client';
import { Service } from './service.interface';
import accountRepository from '../repositories/account.repository';
import userService from './user.service';

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

    async findByUserId(userId: string): Promise<Account[] | null> {
        return accountRepository.findByUserId(userId);
    }
    
    async create(userEmail: string, accountName: string, accountType: AccountType): Promise<Account> {        
        const user = await userService.findByEmail(userEmail);

        if (!user) {
            throw new Error(`Could not find user with email: ${userEmail}`);
        }

        const existingAccount = await accountRepository.findByName(accountName, user.id);
        if (existingAccount) {
            throw new Error('Account with this name already exists under user');
        }

        return accountRepository.create({
            userId: user.id,
            name: accountName,
            type: accountType
        });
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
