import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Schema } from 'mongoose';

export class CreateAppointmentDto {
  @ApiProperty({ example: '686a908fe820b90184fab8d6' })
  @IsString()
  @IsNotEmpty()
  doctorId: Schema.Types.ObjectId;

  @ApiProperty({ example: '2025-07-07T14:00:00' })
  @IsDate()
  @IsNotEmpty()
  date: Date;
}
