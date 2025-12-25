import { GenderEnum } from '@/common/enums/gender.enum';
import { User } from '@/modules/user/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Doctor {
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
  department: string;

  @Prop({ required: true, enum: GenderEnum })
  gender: GenderEnum;

  @Prop({ required: true })
  contactNumber: number;

  @Prop({ required: true })
  age: number;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

export type DoctorDocument = Doctor & Document;
