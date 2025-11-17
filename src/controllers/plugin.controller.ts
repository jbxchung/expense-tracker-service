import { Request } from 'express';
import { Plugin } from '@prisma/client';

import { ApiResponse } from '../types/api-response';
import { StagedTransaction } from '../types/transaction';
import { HttpError } from '../errors/HttpError';

import pluginService from '../services/plugin.service';

class PluginController {
  async executePlugin(req: Request): Promise<ApiResponse<StagedTransaction[]>> {
    const pluginId = req.params.id;
    const { accountId } = req.body;
    const inputFileBuffer = req.file?.buffer;

    if (!pluginId) throw new HttpError(400, 'Plugin ID is required');
    if (!accountId) throw new HttpError(400, 'Account ID is required');
    if (!inputFileBuffer) throw new HttpError(400, 'No file to process uploaded');

    const preview = await pluginService.executePlugin(pluginId, inputFileBuffer, accountId);

    return { success: true, message: 'Plugin executed', data: preview };
  }

  // return a raw list of the categories for a given user (globals + their own)
  async getPlugins(req: Request): Promise<ApiResponse<Plugin[]>> {
    const { userId } = req.query;
    const categories = await pluginService.findGlobal() ?? [];
    
    let message = 'Retrieved all global plugins';
    if (userId) {
      const userCategories = await pluginService.findByUserId(userId as string) ?? [];
      categories?.push(...userCategories);
      message = `Retrieved all plugins for user ${userId}`
    }

    return { success: true, message, data: categories };
  };

  async createPlugin(req: Request): Promise<ApiResponse<Plugin>> {
    if (!req.file) {
      throw new HttpError(400, 'No plugin handler file uploaded');
    }

    const { name, description, userId, fileExtensions } = req.body;

    if (!name) throw new HttpError(400, 'Plugin name is required');

    const plugin = await pluginService.create({
      name,
      description,
      userId: userId || null,
      fileExtensions,
    }, req.file.buffer);

    return { success: true, message: 'Plugin created successfully', data: plugin };
  }

  async updatePlugin(req: Request): Promise<ApiResponse<Plugin>> {
    const pluginId = req.params.id || '';
    const existing = await pluginService.findById(pluginId);
    if (!existing) throw new HttpError(404, 'Plugin not found');
  
    const { name, description, userId, fileExtensions } = req.body;
  
    const updatedPlugin = await pluginService.update(
      pluginId,
      { name, description, userId: userId || null, fileExtensions },
      req.file?.buffer
    );
  
    return { success: true, message: 'Updated plugin', data: updatedPlugin };
  }

  async deletePlugin(req: Request): Promise<ApiResponse<Plugin>> {
    const pluginId = req.params.id || '';
    const existing = await pluginService.findById(pluginId);
    if (!existing) {
      throw new HttpError(404, 'Plugin not found');
    }

    const deletedPlugin = await pluginService.delete(pluginId);
    return { success: true, message: 'Deleted plugin', data: deletedPlugin };
  }
}

export default new PluginController();
