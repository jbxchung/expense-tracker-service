import fs from 'fs';
import path from 'path';
import { Plugin } from '@prisma/client';
import config from '../config/config';
import { DB_GENERATED_FIELDS } from '../repositories/base.repository';
import pluginRepository from '../repositories/plugin.repository';
import { HttpError } from '../errors/HttpError';
import { StagedTransaction } from '../types/transaction';

const ERROR_MESSAGES = {
  ID_NOT_FOUND: 'Could not find plugin with given id: ',
  PLUGIN_NAME_EXISTS: 'Plugin with this name already exists for this scope',
};

class PluginService {
  private pluginDir: string = config.pluginDir;

  constructor() {
    // ensure the plugins directory exists
    if (!fs.existsSync(this.pluginDir)) {
      fs.mkdirSync(this.pluginDir, { recursive: true });
    }
  }

  // run plugin to parse a file and return transaction previews
  async executePlugin(pluginId: string, inputFileBuffer: Buffer, accountId: string): Promise<StagedTransaction[]> {
    const plugin = await pluginRepository.findById(pluginId);
    if (!plugin) throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${pluginId}`);

    // run handler in sandbox
    const handlerFilePath = path.join(this.pluginDir, `${plugin.id}.ts`);
    return this.runHandler(handlerFilePath, inputFileBuffer, accountId);
  }

  private async runHandler(handlerPath: string, file: Buffer, accountId: string): Promise<StagedTransaction[]> {
    // Example: require local TS file dynamically (needs ts-node/register)
    const handler = await import(handlerPath);
    return handler.parse(file, accountId); // should return StagedTransaction[]
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

  async create(plugin: Omit<Plugin, DB_GENERATED_FIELDS>, handlerFile: Buffer): Promise<Plugin> {
    await this.ensureUniqueName(plugin.name, plugin.userId);

    // create plugin record
    const createdPlugin = await pluginRepository.create(plugin);

    // create handler file in plugin directory
    const handlerFilePath = path.join(this.pluginDir, `${createdPlugin.id}.ts`);
    fs.writeFileSync(handlerFilePath, handlerFile);

    return createdPlugin;
  }

  async update(pluginId: string, updateData: Partial<Plugin>, newHandlerFile?: Buffer): Promise<Plugin | undefined> {
    const existingPlugin = await pluginRepository.findById(pluginId);
    if (!existingPlugin) {
      throw new HttpError(400, `${ERROR_MESSAGES.ID_NOT_FOUND}${pluginId}`);
    }

    // check for duplicates if name is being updated
    if (updateData.name && updateData.name !== existingPlugin.name) {
      await this.ensureUniqueName(updateData.name, existingPlugin.userId, existingPlugin.id);
    }

    const updatedPlugin = await pluginRepository.update(pluginId, updateData)

    // update handler file if provided
    if (newHandlerFile) {
      const handlerFilePath = path.join(this.pluginDir, `${pluginId}.ts`);
      fs.writeFileSync(handlerFilePath, newHandlerFile);
    }

    return updatedPlugin;
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
