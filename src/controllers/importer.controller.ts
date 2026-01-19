import { Request } from 'express';
import { Importer } from '@prisma/client';

import { HttpError } from 'errors/HttpError';
import { ApiResponse } from 'types/api-response';
import { StagedTransaction } from 'types/transaction';

import importerService from 'services/importer.service';

class ImporterController {
  async executeImporter(req: Request): Promise<ApiResponse<StagedTransaction[]>> {
    const importerId = req.params.id;
    const inputFileBuffer = req.file?.buffer;

    if (!importerId) throw new HttpError(400, 'Importer ID is required');
    if (!inputFileBuffer) throw new HttpError(400, 'No file to process uploaded');

    const preview = await importerService.executeImporter(importerId, inputFileBuffer);

    return { success: true, message: 'Importer executed', data: preview };
  }

  // return a raw list of the importers for a given user (globals + their own)
  async getImporters(req: Request): Promise<ApiResponse<Importer[]>> {
    const { userId } = req.session;
    const categories = await importerService.findGlobal() ?? [];
    
    let message = 'Retrieved all global importers';
    if (userId) {
      const userCategories = await importerService.findByUserId(userId as string) ?? [];
      categories?.push(...userCategories);
      message = `Retrieved all importers for user ${userId}`
    }

    return { success: true, message, data: categories };
  };

  async createImporter(req: Request): Promise<ApiResponse<Importer>> {
    const { name, description, userId, type, sourceFields, mapping } = req.body;

    if (!name) throw new HttpError(400, 'Importer name is required');

    const importer = await importerService.create({
      name,
      description,
      userId: userId || null,
      type,
      sourceFields,
      mapping,
    });

    return { success: true, message: 'Importer created successfully', data: importer };
  }

  async updateImporter(req: Request): Promise<ApiResponse<Importer>> {
    const importerId = req.params.id || '';
    const existing = await importerService.findById(importerId);
    if (!existing) throw new HttpError(404, 'Importer not found');
  
    const { name, description, userId, type, mapping } = req.body;
  
    const updatedImporter = await importerService.update(
      importerId,
      { name, description, userId: userId || null, type, mapping }
    );
  
    return { success: true, message: 'Updated importer', data: updatedImporter };
  }

  async deleteImporter(req: Request): Promise<ApiResponse<Importer>> {
    const importerId = req.params.id || '';
    const existing = await importerService.findById(importerId);
    if (!existing) {
      throw new HttpError(404, 'Importer not found');
    }

    const deletedImporter = await importerService.delete(importerId);
    return { success: true, message: 'Deleted importer', data: deletedImporter };
  }
}

export default new ImporterController();
