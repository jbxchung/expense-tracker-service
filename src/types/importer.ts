import { Importer as PrismaImporter } from '@prisma/client';

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

export type FieldMapping = {
  field: string;
  title: string;
  rules: FieldMappingRule[];
}

export type FieldMappingRule = {
  condition: FieldMappingRuleCondition;
  action: FieldMappingRuleAction;
};

export type FieldMappingRuleCondition = {
  column: string;
  type: FieldMappingRuleConditionType;
  exact?: string[];
  startsWith?: string[];
  includes?: string[];
  regex?: string;
}
export const FieldMappingRuleConditionTypes = {
  EXISTS: 'exists',
  MATCHES: 'matches',
  STARTS_WITH: 'startsWith',
  INCLUDES: 'includes',
  REGEX: 'regex',
} as const;
export type FieldMappingRuleConditionType = typeof FieldMappingRuleConditionTypes[keyof typeof FieldMappingRuleConditionTypes];
export const FieldMappingRuleConditionTypeLabels = {
  [FieldMappingRuleConditionTypes.EXISTS]: 'exists',
  [FieldMappingRuleConditionTypes.MATCHES]: 'exactly matches',
  [FieldMappingRuleConditionTypes.STARTS_WITH]: 'starts with',
  [FieldMappingRuleConditionTypes.INCLUDES]: 'includes',
  [FieldMappingRuleConditionTypes.REGEX]: 'matches regex',
};


export type FieldMappingRuleAction = {
  type: 'useColumn' | 'setValue';
  column?: string;
  value?: string;
  // transform?: 'uppercase' | 'lowercase' | 'trim';
}
export const FieldMappingRuleActionTypes = {
  USE_COLUMN: 'useColumn',
  SET_VALUE: 'setValue',
} as const;
export type FieldMappingRuleActionType = typeof FieldMappingRuleActionTypes[keyof typeof FieldMappingRuleActionTypes];
export const FieldMappingRuleActionTypeLabels = {
  [FieldMappingRuleActionTypes.USE_COLUMN]: 'use',
  [FieldMappingRuleActionTypes.SET_VALUE]: 'set value to',
};