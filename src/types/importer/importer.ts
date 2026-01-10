import { Importer as PrismaImporter } from '@prisma/client';
import { Condition } from './condition';
import { Action } from './action';

// prisma's `mapping` field is a JsonValue, we want it typed as ImporterMapping
export interface Importer extends Omit<PrismaImporter, 'sourceFields' | 'mapping'> {
  sourceFields: string[];
  mapping: ImporterMapping;
}

export function toImporter(db: PrismaImporter): Importer {
  return {
    ...db,
    sourceFields: db.sourceFields as unknown as string[],
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
  id: string;
  title: string;
  rules: FieldRule[];
}

export interface FieldRule {
  condition: Condition;
  action: Action;
}