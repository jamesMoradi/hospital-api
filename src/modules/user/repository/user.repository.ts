import { MongoBaseRepository } from '@/common/database/abstract-repository';
import { Injectable, Logger } from '@nestjs/common';
import { User, UserDocument, UserModel } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository extends MongoBaseRepository<UserDocument> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name)
    model: UserModel,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(model);
  }
}
