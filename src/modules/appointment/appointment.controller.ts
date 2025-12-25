import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@common/auth/role.guard';
import { Role } from '@common/auth/role.decorator';
import { AppointmentService } from './appointment.service';
import { Roles } from '@common/enums/role.enum';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Req as CostumeRequest } from '@/common/request';
import { IApiResponse, IPagination } from '@/common';
import { Schema } from 'mongoose';
import { AppointmentDocument } from './schema/appointment.schema';

@ApiTags('Appointment')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @ApiOperation({
    summary: "Book an appointment (Patient only) (Use Doctor's _id)",
    description:
      'Patients can book an appointment by providing doctorId and date.',
  })
  @ApiBody({
    type: CreateAppointmentDto,
  })
  @ApiResponse({ status: 201, description: 'Appointment booked successfully' })
  @ApiResponse({
    status: 403,
    description: 'Only patients can book appointments',
  })
  @Post()
  @Role(Roles.PATIENT)
  book(@Req() req: CostumeRequest, @Body() dto: CreateAppointmentDto) {
    const userId = req.user!.sub;
    return this.appointmentService.bookAppointment(
      new Schema.Types.ObjectId(userId),
      dto,
    );
  }

  @ApiOperation({
    summary: 'View own appointments (Doctor or Patient)',
    description:
      'Doctors can view appointments assigned to them. Patients can view their own appointments.',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointments fetched successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied for unauthorized roles',
  })
  @Get('me')
  findMyAppointment(
    @Req() request: CostumeRequest,
    @Body() paginationPayload: IPagination,
  ): IApiResponse<AppointmentDocument[]> {
    const { role, sub } = request.user!;
    return this.appointmentService.findMyAppointments(
      { role, userId: new Schema.Types.ObjectId(sub) },
      paginationPayload,
    );
  }

  @ApiOperation({
    summary: 'Update appointment status (Doctor only)',
    description:
      'Allows a doctor to update appointment status (e.g., completed, cancelled).',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The appointment ID',
    example: '64b9876543210fedcba98765',
  })
  @ApiBody({
    type: UpdateAppointmentDto,
    examples: {
      statusExample: {
        summary: 'Mark appointment as completed',
        value: {
          status: 'completed',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment status updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Only doctors can update appointment status',
  })
  @Patch(':id')
  @Role(Roles.DOCTOR)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
  ): IApiResponse<AppointmentDocument> {
    return this.appointmentService.updateStatus(id, dto);
  }
}
