import { Importer } from '@prisma/client';
import { StagedTransaction } from 'types/transaction';
import { CsvImportEngine } from './csv.engine';

export interface ImportEngine {
  run(fileBuffer: Buffer, importer: Importer): Promise<StagedTransaction[]>;
}

export function getEngine(importer: Importer): ImportEngine {
  switch (importer.type) {
    case 'CSV':
        return new CsvImportEngine();
    // todo - implement more engines
    // case 'PDF':
    //   return new PdfImportEngine();
    default:
        throw new Error(`No import engine found for type: ${importer.type}`);
  }
}