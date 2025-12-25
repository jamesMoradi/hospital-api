import { ConfigModule } from '@nestjs/config';

export const VirtualEnvironmentConfig = () =>
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  });
