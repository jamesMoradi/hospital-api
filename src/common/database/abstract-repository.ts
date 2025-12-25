import { QueryFilter, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class MongoBaseRepository<TDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(data: Partial<TDocument>) {
    const entity = new this.model(data);
    return entity.save();
  }

  async findOne(filter: QueryFilter<TDocument>) {
    return this.model.findOne(filter).exec();
  }

  async findOneOrThrow(filter: QueryFilter<TDocument>) {
    const entity = await this.findOne(filter);
    if (!entity) {
      this.logger.warn(`Entity not found: ${JSON.stringify(filter)}`);
      throw new NotFoundException(`${this.model.modelName} not found`);
    }
    return entity;
  }

  async findAll(filter: QueryFilter<TDocument> = {}) {
    return this.model.find(filter).exec();
  }

  async update(
    filter: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
    options: QueryOptions = { new: true },
  ) {
    return this.model.findOneAndUpdate(filter, update, options).exec();
  }

  async updateOrThrow(
    filter: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
    options: QueryOptions = { new: true },
  ) {
    const entity = await this.update(filter, update, options);
    if (!entity) {
      throw new NotFoundException(
        `${this.model.modelName} not found for update`,
      );
    }
    return entity;
  }

  async delete(filter: QueryFilter<TDocument>) {
    return this.model.findOneAndDelete(filter).exec();
  }

  async exists(filter: QueryFilter<TDocument>): Promise<boolean> {
    return !!(await this.model.exists(filter));
  }

  async count(filter: QueryFilter<TDocument> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
