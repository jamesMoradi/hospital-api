import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const MongoDbConfig = () =>
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI'),
    }),
  });
