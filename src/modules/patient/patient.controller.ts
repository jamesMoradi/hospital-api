import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePatientDto } from './dto/update-patient.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '@/common/auth/role.guard';
import { PatientService } from './patient.service';
import { Role } from '@/common/auth/role.decorator';
import { IApiResponse, IPagination, Roles } from '@/common';
import { Schema } from 'mongoose';
import { Req as CostumeRequest } from '@/common/request';
import { UpdateSpecialNoteDto } from './dto/update-special-note.dto';
import { PatientDocument } from './schema/patient.schema';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({
    summary: 'Get profile of the logged-in patient (Patient only)',
    description: 'Returns profile details for the currently logged-in patient.',
  })
  @ApiResponse({
    status: 200,
    description: 'Patient profile retrieved successfully',
  })
  @Get('me')
  @Role(Roles.PATIENT)
  getMyProfile(@Req() req: CostumeRequest) {
    const userId = req.user!.sub;
    return this.patientService.findByUserId(new Schema.Types.ObjectId(userId));
  }

  @ApiOperation({
    summary: 'Update profile of the logged-in patient (Patient only)',
    description: 'Allows a patient to update their personal details.',
  })
  @ApiBody({
    type: UpdatePatientDto,
    examples: {
      updateExample: {
        summary: 'Update patient profile',
        value: {
          age: 25,
          gender: 'Female',
          contactNumber: '9876543210',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Patient profile updated successfully',
  })
  @Patch('me')
  @Role(Roles.PATIENT)
  updateMyProfile(@Body() dto: UpdatePatientDto, @Req() req: CostumeRequest) {
    const userId = req.user!.sub;
    return this.patientService.update(dto, new Schema.Types.ObjectId(userId));
  }

  @ApiOperation({
    summary: 'Get all patients (Admin/Doctor only)',
    description:
      'Returns a list of all registered patients. Restricted to doctors and admins.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all patients retrieved successfully',
  })
  @Get('all')
  @Role(Roles.DOCTOR, Roles.ADMIN)
  getAll(
    @Body() paginationPayload: IPagination,
  ): IApiResponse<PatientDocument[]> {
    return this.patientService.findAll(paginationPayload);
  }

  @ApiOperation({
    summary: 'Get a specific patient by ID (Admin/Doctor only)',
    description:
      'Allows a doctor or admin to view any patient profile by ID.(Use user ID of the Patient)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the patient to retrieve',
    example: '64b1234567890abcdef12345',
  })
  @ApiResponse({
    status: 200,
    description: 'Patient profile retrieved successfully',
  })
  @Get(':id')
  @Role(Roles.DOCTOR, Roles.ADMIN)
  findOne(@Param('id') id: string): IApiResponse<PatientDocument> {
    return this.patientService.findByUserId(new Schema.Types.ObjectId(id));
  }

  @ApiTags('Doctors')
  @ApiOperation({
    summary: 'Add special note to a patient (Doctor only)',
    description:
      'Allows a doctor to add special medical notes to a patient record.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the patient to update',
    example: '64b1234567890abcdef12345',
  })
  @ApiBody({
    type: UpdateSpecialNoteDto,
    examples: {
      noteExample: {
        summary: 'Example: Add note',
        value: {
          specialNote:
            'Patient has a history of high blood pressure. Monitor weekly.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Special note added successfully' })
  @Patch(':id')
  @Role(Roles.DOCTOR)
  updatePatient(
    @Param('id') id: string,
    @Body() dto: UpdateSpecialNoteDto,
  ): IApiResponse<PatientDocument> {
    return this.patientService.addSpecialNote(
      new Schema.Types.ObjectId(id),
      dto,
    );
  }
}
