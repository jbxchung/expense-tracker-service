import crypto from 'crypto';

import { Account } from '../../models/account';
import { BaseRepository } from './base.repository';

class AccountRepository extends BaseRepository<Account, string> {
  ID_LENGTH = 12;

  constructor() {
    super('accounts');
  }

  // auto generate account id from its name
  protected generateId(entity: Account): string {
    return crypto.createHash('sha1').update(entity.name).digest('hex').substring(0, this.ID_LENGTH);
  }

  async findByName(accountName: string): Promise<Account | undefined> {
    const accounts = await this.findAll();
    return accounts.find(account => account.name === accountName);
  }
}

export default new AccountRepository();
