import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schema/patient.schema';
import { PatientService } from './patient.service';
import { PatientsController } from './patient.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
  controllers: [PatientsController],
  providers: [PatientService],
  exports: [PatientService, MongooseModule],
})
export class PatientModule {}
