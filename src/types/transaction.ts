import { Transaction } from '@prisma/client';
import { DB_GENERATED_FIELDS } from '../repositories/base.repository';

// prisma generates our actual domain classes but we want to preview Transactions before they are persisted
export type StagedTransaction = Omit<Transaction, DB_GENERATED_FIELDS | 'accountId'>;
