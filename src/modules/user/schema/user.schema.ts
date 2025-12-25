import { Roles } from '@/common/enums/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, unique: [true, 'mailID already exist'] })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Roles })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document & { _id: ObjectId };
