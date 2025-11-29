import { Importer as PrismaImporter } from '@prisma/client';
import { Condition } from './condition';
import { Action } from './action';

// prisma's `mapping` field is a JsonValue, we want it typed as ImporterMapping
export interface Importer extends Omit<PrismaImporter, 'mapping'> {
  mapping: ImporterMapping;
}
export function toImporter(db: PrismaImporter): Importer {
  return {
    ...db,
    mapping: db.mapping as unknown as ImporterMapping,
  };
}

export interface ImporterMapping {
  date: FieldMapping;
  amount: FieldMapping;
  category: FieldMapping;
  description: FieldMapping;
  originalDescription: FieldMapping;

  // todo: allow additional custom fields?
  [key: string]: FieldMapping;
}

export interface FieldMapping {
  title: string;
  rules: FieldRule[];
}

export interface FieldRule {
  condition: Condition;
  action: Action;
}