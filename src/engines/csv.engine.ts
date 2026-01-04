import { Importer } from '@prisma/client';

import { FieldRule, ImporterMapping, toImporter } from 'types/importer/importer';
import { StagedTransaction, } from 'types/transaction';
import { ConditionType } from 'types/importer/condition';
import { FieldActionType, TransformType } from 'types/importer/action';

import { ImportEngine } from './engine';

export class CsvImportEngine implements ImportEngine {
  async run(fileBuffer: Buffer, importer: Importer): Promise<StagedTransaction[]> {
    
    const rows = this.parseCsv(fileBuffer);

    console.log(importer);
    console.log(rows);

    const { mapping } = toImporter(importer);

    // apply mappnig to all rows
    const results = rows.map(row => this.processRow(row, mapping));

    console.log(results);
    return results;
  }

  // parse csv into a list of rows where each row is an object with column names as keys
  private parseCsv(buffer: Buffer): Record<string, string>[] {
    const csvString = buffer.toString('utf-8');
    const lines = csvString.split('\n').filter(line => line.trim() !== '');
    if (!lines) {
      throw new Error('CSV file is empty or invalid');
    }
    const headers = lines[0]!.split(',').map(header => header.trim());
    if (!headers) {
      throw new Error('CSV file has no headers');
    }
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      return row;
    });
    return rows;
  }

  private processRow(row: Record<string, string>, mapping: ImporterMapping): StagedTransaction {
    const output: StagedTransaction = {};

    for (const [fieldKey, fieldMapping] of Object.entries(mapping)) {
      output[fieldKey as keyof StagedTransaction] = this.applyRules(fieldMapping.rules, row);
    }

    return output;
  }

  private applyRules(rules: FieldRule[], row: Record<string, string>): any {
    for (const rule of rules) {
      if (this.evaluateCondition(rule.condition, row)) {
        return this.applyAction(rule.action, row);
      }
    }
    // fallback to empty string if no rule matches
    return '';
  }

  private evaluateCondition(cond: any, row: Record<string, string>): boolean {
    const value = row[cond.column];

    try {
      switch (cond.type) {
        case ConditionType.Exists:
          return value !== undefined && value !== "";
        case ConditionType.IsDate:
          return !isNaN(Date.parse(value!));
        case ConditionType.Regex:
          return (cond.patterns ?? []).some((p: string) => new RegExp(p).test(value!));
        case ConditionType.MultiMatch:
          const { exact = [], startsWith = [], regex = [] } = cond;
          if (exact.includes(value)) return true;
          if (startsWith.some((p: string) => value!.startsWith(p))) return true;
          if (regex.some((p: string) => new RegExp(p).test(value!))) return true;
          return false;
        default:
          return false;
      }
    } catch (e) {
      console.error('Error evaluating condition', e);
      return false;
    }
  }

  private applyAction(action: any, row: Record<string, string>): any {
    switch (action.type) {
      case FieldActionType.UseColumn: {
        let val = row[action.column];
        if (val === undefined) return undefined;

        if (action.transform) {
          switch (action.transform) {
            case TransformType.ParseDate:
              return new Date(val);
            case TransformType.Trim:
              return val.trim();
            case TransformType.Uppercase:
              return val.toUpperCase();
            case TransformType.Lowercase:
              return val.toLowerCase();
            default:
              console.warn('Unknown transform type, will return raw value with no-op:', action.transform);
              return val;
          }
        }
        return val;
      }
      case FieldActionType.SetValue:
        return action.value;
    }
  }
}
