import { AppointmentStatus } from '@/common/enums/appointment-status';
import { Doctor } from '@/modules/doctor/schema/doctor.schema';
import { Patient } from '@/modules/patient/schema/patient.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Patient.name,
    required: true,
  })
  patientId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Doctor.name,
    required: true,
  })
  doctorId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({
    required: false,
    default: AppointmentStatus.SCHEDULED,
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
export type AppointmentDocument = Document & Appointment;
