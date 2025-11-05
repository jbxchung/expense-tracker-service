import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

import { Account } from '../models/account';
import { Service } from './service.interface';

class AccountService implements Service {
    ID_LENGTH = 8;
    accounts: Account[] = [];
    accountsConfigPath?: string;

    async initialize(): Promise<void> {
        const accountsDirectory = path.join(process.cwd(), 'resources/accounts');
        this.accountsConfigPath = path.join(accountsDirectory, 'accounts.json');

        const accountsJson = await fs.readFile(this.accountsConfigPath, 'utf8');

        // const dirents = await fs.readdir(accountsDirectory, { withFileTypes: true });
        // const directories = dirents.filter(d => d.isDirectory()).map(d => d.name);
        // return dirents.filter(d => d.isDirectory()).map(d => d.name);

        // todo - handle edge and error cases
        this.accounts = JSON.parse(accountsJson);
        console.info(`Loaded accounts:\n\t${this.accounts.map(a => a.name).join('\n\t')}`);
    }

    async findAll(): Promise<Account[]> {
        return this.accounts;
    }

    async findById(accountId: string): Promise<Account | undefined> {
        return this.accounts.find(account => account.id === accountId);
    }

    async findByName(accountName: string): Promise<Account | undefined> {
        return this.accounts.find(account => account.name === accountName);
    }
    
    async create(accountName: string): Promise<Account> {
        const existing = await this.findByName(accountName);
        if (existing) {
            throw new Error('Account with this name already exists');
        }

        if (!this.accountsConfigPath) {
            throw new Error('Error resolving accounts configuratin path');
        }

        const id = crypto.createHash('sha1').update(accountName).digest('hex').substring(0, this.ID_LENGTH);
        console.info('Creating account with name:', id);
        const newAccount: Account = {
            id,
            name: accountName,
        };

        // add to in-mem list
        this.accounts.push(newAccount);
        // persist
        await fs.writeFile(this.accountsConfigPath, JSON.stringify(this.accounts, null, 4));

        // return created account
        return newAccount;
    }

    async delete(accountId: string): Promise<Account | undefined> {
        const existing = await this.findById(accountId);
        if (!existing) {
            throw new Error(`Could not find account to delete: ${accountId}`);
        }

        // delete from in-mem list
        const deletedAccount = this.accounts.splice(this.accounts.indexOf(existing), 1)[0];
        // persist
        await fs.writeFile(this.accountsConfigPath!, JSON.stringify(this.accounts, null, 4));
        
        return deletedAccount;
    }
}

export default new AccountService();
