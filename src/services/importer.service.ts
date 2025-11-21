import { Importer } from '@prisma/client';
import { DB_GENERATED_FIELDS } from '../repositories/base.repository';
import importerRepository from '../repositories/importer.repository';
import { HttpError } from '../errors/HttpError';
import { StagedTransaction } from '../types/transaction';

const ERROR_MESSAGES = {
  ID_NOT_FOUND: 'Could not find importer with given id: ',
  IMPORTER_NAME_EXISTS: 'Importer with this name already exists for this scope',
};

class ImporterService {
  // run importer to parse a file and return transaction previews
  async executeImporter(importerId: string, inputFileBuffer: Buffer, accountId: string): Promise<StagedTransaction[]> {
    const importer = await importerRepository.findById(importerId);
    if (!importer) throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${importerId}`);

    // TODO - execute the importer
    throw new Error('Importer execution not yet implemented');
  }

  // -----------------
  // Raw Importer CRUD
  // -----------------

  async findById(importerId: string): Promise<Importer | null> {
    return importerRepository.findById(importerId);
  }

  async findGlobal(): Promise<Importer[] | null> {
    return importerRepository.findGlobal();
  }

  async findByUserId(userId: string, includeGlobal = false): Promise<Importer[]> {
    return await importerRepository.findByUserId(userId, includeGlobal);
  }

  async create(importer: Omit<Importer, DB_GENERATED_FIELDS>): Promise<Importer> {
    await this.ensureUniqueName(importer.name, importer.userId);

    return importerRepository.create(importer);
  }

  async update(importerId: string, updateData: Partial<Importer>): Promise<Importer | undefined> {
    const existingImporter = await importerRepository.findById(importerId);
    if (!existingImporter) {
      throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${importerId}`);
    }

    // check for duplicates if name is being updated
    if (updateData.name && updateData.name !== existingImporter.name) {
      await this.ensureUniqueName(updateData.name, existingImporter.userId, existingImporter.id);
    }

    return importerRepository.update(importerId, updateData)
  }

  async delete(importerId: string): Promise<Importer | undefined> {
    const existing = await importerRepository.findById(importerId);
    if (!existing) {
      throw new Error(`Could not find importer to delete: ${importerId}`);
    }

    return importerRepository.remove(importerId);
  }

  // utility to check for duplicate importer names within the same scope
  private async ensureUniqueName(name: string, userId?: string | null, excludeId?: string) {
    const existingPlugin = await importerRepository.findByName(name, userId ?? undefined);
    if (existingPlugin && existingPlugin.id !== excludeId) {
      throw new HttpError(400, ERROR_MESSAGES.IMPORTER_NAME_EXISTS);
    }
  }
}

export default new ImporterService();
