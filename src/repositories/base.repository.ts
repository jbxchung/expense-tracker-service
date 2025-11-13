// extract entity type from a Prisma delegate
type EntityOf<TDelegate> =
  TDelegate extends { findUnique(args?: any): Promise<infer T | null> } ? T : never;

// extract ID type from an entity
type IdOf<TEntity> = TEntity extends { id: infer TId } ? TId : never;

export type DB_GENERATED_FIELDS = 'id' | 'createdAt' | 'updatedAt';

export abstract class BaseRepository<TDelegate extends { findUnique: any; findMany: any; create: any; update: any; delete: any; }> {
  protected model: TDelegate;

  constructor(delegate: TDelegate) {
    this.model = delegate;
  }

  async findAll(): Promise<EntityOf<TDelegate>[]> {
    return this.model.findMany();
  }

  async findById(id: IdOf<EntityOf<TDelegate>>): Promise<EntityOf<TDelegate> | null> {
    return this.model.findUnique({ where: { id } });
  }

  async create(data: Omit<EntityOf<TDelegate>, DB_GENERATED_FIELDS>): Promise<EntityOf<TDelegate>> {
    return this.model.create({ data });
  }

  async update(id: IdOf<EntityOf<TDelegate>>, data: Partial<Omit<EntityOf<TDelegate>, DB_GENERATED_FIELDS>>): Promise<EntityOf<TDelegate>> {
    return this.model.update({ where: { id }, data });
  }

  async remove(id: IdOf<EntityOf<TDelegate>>): Promise<EntityOf<TDelegate>> {
    return this.model.delete({ where: { id } });
  }
}

export default BaseRepository;
