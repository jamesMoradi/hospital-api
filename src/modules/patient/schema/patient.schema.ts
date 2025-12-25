import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/schema/user.schema';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Patient {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  contactNumber: number;

  @Prop({ default: '', required: false })
  specialNote: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
export type PatientDocument = Patient & Document;
