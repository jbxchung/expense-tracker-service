export interface Account {
  id: string;
  name: string;
  type: AccountType;
};

export enum AccountType {
  CHECKING = 'Checking',
  SAVINGS = 'Savings',
  CREDIT_CARD = 'Credit Card',
};
