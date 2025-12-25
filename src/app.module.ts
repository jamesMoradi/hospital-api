import { Module } from '@nestjs/common';
import { VirtualEnvironmentConfig } from './config/virtual-environment.config';
import { MongoDbConfig } from './config/mongodb.config';

@Module({
  imports: [VirtualEnvironmentConfig(), MongoDbConfig()],
  controllers: [],
  providers: [],
})
export class AppModule {}
