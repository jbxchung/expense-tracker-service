// rule Condition definitions
export enum ConditionType {
  Exists = 'exists',
  IsDate = 'isDate',
  Regex = 'regex',
  MultiMatch = 'multiMatch',
}

export type BaseCondition = { type: ConditionType; column: string };

export interface ExistsCondition extends BaseCondition {
  type: ConditionType.Exists;
}

export interface IsDateCondition extends BaseCondition {
  type: ConditionType.IsDate;
}

export interface RegexCondition extends BaseCondition {
  type: ConditionType.Regex;
  patterns: string[];
}

export interface MultiMatchCondition extends BaseCondition {
  type: ConditionType.MultiMatch;
  exact?: string[];
  startsWith?: string[];
  regex?: string[];
}

export type Condition = ExistsCondition | IsDateCondition | RegexCondition | MultiMatchCondition;
