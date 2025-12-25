// src/common/interfaces/mongo-repository.interface.ts
import { Document, UpdateQuery, QueryFilter } from 'mongoose';
import { IPagination } from '../response';

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findOne(filter: QueryFilter<T>): Promise<T | null>;
  findOneOrThrow(filter: QueryFilter<T>): Promise<T>;
  findAll(filter?: QueryFilter<T>): Promise<T[]>;
  findPaginated(
    pagination: IPagination,
    filter?: QueryFilter<T>,
    sort?: any,
  ): Promise<[T[], number]>;
  update(filter: QueryFilter<T>, update: UpdateQuery<T>): Promise<T | null>;
  updateOrThrow(filter: QueryFilter<T>, update: UpdateQuery<T>): Promise<T>;
  delete(filter: QueryFilter<T>): Promise<T | null>;
  deleteOrThrow(filter: QueryFilter<T>): Promise<T>;
  count(filter?: QueryFilter<T>): Promise<number>;
  exists(filter: QueryFilter<T>): Promise<boolean>;
}
