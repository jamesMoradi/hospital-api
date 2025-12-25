import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schema/patient.schema';
import { PatientService } from './patient.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
  controllers: [],
  providers: [PatientService],
  exports: [PatientService, MongooseModule],
})
export class PatientModule {}
