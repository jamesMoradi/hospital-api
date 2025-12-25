import { AppointmentStatus } from '@/common/enums/appointment-status';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateAppointmentDto {
  @ApiProperty({ example: AppointmentStatus.CANCELLED })
  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status: AppointmentStatus;
}
