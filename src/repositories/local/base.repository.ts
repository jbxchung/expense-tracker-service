// src/repositories/base.repository.ts
import fsSync from 'fs';
import fs from 'fs/promises';
import path from 'path';

export abstract class BaseRepository<T extends { id: K }, K> {
  protected dataPath: string;

  constructor(entityName: string) {
    // store all files under <project root>/_localpersistence/<entity>.json
    const localPersistenceDirectory = path.join(process.cwd(), '_localpersistence');
    this.dataPath = path.join(localPersistenceDirectory, `${entityName}.json`);

    // create directory if it doesnt exist
    try {
      if (!fsSync.existsSync(this.dataPath)) {
        fsSync.mkdirSync(localPersistenceDirectory, { recursive: true });
        fsSync.writeFileSync(this.dataPath, JSON.stringify([], null, 2), 'utf-8');
      }
    } catch (error) {
      console.error(`Error initializing local filesystem repository for ${entityName}`, error);
    }
  }

  protected abstract generateId(entity: Omit<T, 'id'>): K;

  protected async readAll(): Promise<T[]> {
    try {
      const raw = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(raw) as T[];
    } catch (err: any) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  protected async writeAll(items: T[]): Promise<void> {
    await fs.writeFile(this.dataPath, JSON.stringify(items, null, 2), 'utf-8');
  }

  public async findAll(): Promise<T[]> {
    return this.readAll();
  }

  public async findById(id: K): Promise<T | undefined> {
    const entities = await this.readAll();
    return entities.find((i) => i.id === id);
  }

  public async create(entity: Omit<T, 'id'>): Promise<T> {
    const entities = await this.readAll();
    const newEntity: T = { id: this.generateId(entity), ...entity } as T;
    entities.push(newEntity);
    await this.writeAll(entities);
    return newEntity;
  }

  public async update(id: K, update: Partial<Omit<T, 'id'>>): Promise<T> {
    const entities = await this.readAll();
    const idx = entities.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Entity not found');
    entities[idx] = { ...entities[idx], ...update } as T;
    await this.writeAll(entities);
    return entities[idx] as T;
  }

  public async remove(id: K): Promise<T | undefined> {
    const entities = await this.readAll();
    const idx = entities.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Entity not found');
    const removed = entities.splice(idx, 1)[0];
    await this.writeAll(entities);
    return removed;
  }
}
