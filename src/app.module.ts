import { Module } from '@nestjs/common';
import { VirtualEnvironmentConfig } from './config/virtual-environment.config';
import { MongoDbConfig } from './config/mongodb.config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [VirtualEnvironmentConfig(), MongoDbConfig(), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
