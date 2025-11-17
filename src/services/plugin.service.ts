import { Plugin, Transaction } from '@prisma/client';
import { DB_GENERATED_FIELDS } from '../repositories/base.repository';
import pluginRepository from '../repositories/plugin.repository';
import { HttpError } from '../errors/HttpError';
import { StagedTransaction } from '../types/transaction';

const ERROR_MESSAGES = {
  ID_NOT_FOUND: 'Could not find plugin with given id: ',
  PLUGIN_NAME_EXISTS: 'Plugin with this name already exists for this scope',
};

class PluginService {
  // run plugin to parse a file and return transaction previews
  async executePlugin(pluginId: string, fileBuffer: Buffer, accountId: string): Promise<StagedTransaction[]> {
    const plugin = await pluginRepository.findById(pluginId);
    if (!plugin) throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${pluginId}`);

    // 1. Run TS/JS handler in sandbox
    // 2. Or call external service
    return this.runHandler(plugin.handler, fileBuffer, accountId);
  }

  private async runHandler(handlerPath: string, file: Buffer, accountId: string): Promise<StagedTransaction[]> {
    // Example: require local TS file dynamically (needs ts-node/register)
    const handler = await import(handlerPath);
    return handler.parse(file, accountId); // should return Transaction[]
  }

  // -----------------
  // Raw Plugin CRUD
  // -----------------

  async findById(pluginId: string): Promise<Plugin | null> {
    return pluginRepository.findById(pluginId);
  }

  async findGlobal(): Promise<Plugin[] | null> {
    return pluginRepository.findGlobal();
  }

  async findByUserId(userId: string, includeGlobal = false): Promise<Plugin[]> {
    return await pluginRepository.findByUserId(userId, includeGlobal);
  }

  async create(plugin: Omit<Plugin, DB_GENERATED_FIELDS>): Promise<Plugin> {
    await this.ensureUniqueName(plugin.name, plugin.userId);

    
    const createdPlugin = pluginRepository.create(plugin);
    
    // todo - create file in plugin directory

    return createdPlugin;
  }

  async update(pluginId: string, updateData: Partial<Plugin>): Promise<Plugin | undefined> {
    const existingPlugin = await pluginRepository.findById(pluginId);
    if (!existingPlugin) {
      throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${pluginId}`);
    }

    // check for duplicates if name is being updated
    if (updateData.name && updateData.name !== existingPlugin.name) {
      await this.ensureUniqueName(updateData.name, existingPlugin.userId, existingPlugin.id);
    }

    return pluginRepository.update(pluginId, updateData);
  }

  async delete(pluginId: string): Promise<Plugin | undefined> {
    const existing = await pluginRepository.findById(pluginId);
    if (!existing) {
      throw new Error(`Could not find plugin to delete: ${pluginId}`);
    }

    return pluginRepository.remove(pluginId);
  }

  // utility to check for duplicate plugin names within the same scope
  private async ensureUniqueName(name: string, userId?: string | null, excludeId?: string) {
    const existingPlugin = await pluginRepository.findByName(name, userId ?? undefined);
    if (existingPlugin && existingPlugin.id !== excludeId) {
      throw new HttpError(400, ERROR_MESSAGES.PLUGIN_NAME_EXISTS);
    }
  }
}

export default new PluginService();
