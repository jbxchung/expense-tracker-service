// rule Action definitions
export enum FieldActionType {
  UseColumn = 'useColumn',
  SetValue = 'setValue',
}

export enum TransformType {
  Negate = 'negate',
  ParseDate = 'parseDate',
  Trim = 'trim',
  Uppercase = 'uppercase',
  Lowercase = 'lowercase',
}

export interface UseColumnAction {
  type: FieldActionType.UseColumn;
  column: string;
  transform?: TransformType;
}

export interface SetValueAction {
  type: FieldActionType.SetValue;
  value: any;
}

export type Action = UseColumnAction | SetValueAction;
