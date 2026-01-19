import { Importer } from '@prisma/client';

import { FieldMappingRule, FieldMappingRuleAction, FieldMappingRuleActionTypes, FieldMappingRuleCondition, FieldMappingRuleConditionTypes, ImporterMapping, toImporter } from 'types/importer';
import { StagedTransaction, } from 'types/transaction';

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

  private applyRules(rules: FieldMappingRule[], row: Record<string, string>): any {
    for (const rule of rules) {
      if (this.evaluateCondition(rule.condition, row)) {
        return this.applyAction(rule.action, row);
      }
    }
    // fallback to empty string if no rule matches
    return '';
  }

  private evaluateCondition(cond: FieldMappingRuleCondition, row: Record<string, string>): boolean {
    const value = row[cond.column];

    if (!value) {
      return false;
    }

    try {
      switch (cond.type) {
        case FieldMappingRuleConditionTypes.EXISTS:
          return value !== undefined && value !== "";
        case FieldMappingRuleConditionTypes.MATCHES:
          return cond.exact?.includes(value) ?? false;
        case FieldMappingRuleConditionTypes.STARTS_WITH:
          return cond.startsWith?.some((p: string) => value!.startsWith(p)) ?? false;
        case FieldMappingRuleConditionTypes.INCLUDES:
          return cond.includes?.some((p: string) => value!.includes(p)) ?? false;
        case FieldMappingRuleConditionTypes.REGEX:
          return cond.regex ? new RegExp(cond.regex).test(value!) : false;
        default:
          return false;
      }
    } catch (e) {
      console.error('Error evaluating condition', e);
      return false;
    }
  }

  private applyAction(action: FieldMappingRuleAction, row: Record<string, string>): any {
    switch (action.type) {
      case FieldMappingRuleActionTypes.USE_COLUMN: {
        if (!action.column) return undefined;

        let val = row[action.column];
        if (val === undefined) return undefined;

        return val;
      }
      case FieldMappingRuleActionTypes.SET_VALUE:
        return action.value;
    }
  }
}

function trimQuotes(str: string): string {
  if (!str) return str;
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1);
  }
  return str;
}