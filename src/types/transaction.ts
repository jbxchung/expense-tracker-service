import { Transaction } from '@prisma/client';
import { DB_GENERATED_FIELDS } from 'repositories/base.repository';

export type TransactionBatchCreateRequestBody = {
  transactions: TransactionCreateInput[];
  fileName?: string;
  importerId?: string;
}

// prisma generates our actual domain classes but we want to preview Transactions before they are persisted
export type TransactionCreateInput = Omit<Transaction, DB_GENERATED_FIELDS | 'accountId'>;

// we want to build incomplete transactions from the engine and present them to the user for editing before persisting anything
export type StagedTransaction = Partial<Omit<TransactionCreateInput, 'amount' > & {
  amount: number;
}>
