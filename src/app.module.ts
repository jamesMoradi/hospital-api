import { Module } from '@nestjs/common';
import { VirtualEnvironmentConfig } from './config/virtual-environment.config';
import { MongoDbConfig } from './config/mongodb.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PatientModule } from './modules/patient/patient.module';

@Module({
  imports: [
    VirtualEnvironmentConfig(),
    MongoDbConfig(),
    AuthModule,
    UserModule,
    AppointmentModule,
    DoctorModule,
    PatientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
