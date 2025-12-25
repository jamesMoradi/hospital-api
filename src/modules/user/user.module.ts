import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';
import { PatientService } from '../patient/patient.service';
import { DoctorServices } from '../doctor/doctor.service';
import { PatientModule } from '../patient/patient.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [
    PatientModule,
    DoctorModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, PatientService, DoctorServices],
})
export class UserModule {}
