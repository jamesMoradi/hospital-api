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
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '@/common/auth/role.guard';
import { DoctorService } from './doctor.service';
import { Role } from '@/common/auth/role.decorator';
import { Req as CostumeRequest } from '@/common/request';
import { Schema } from 'mongoose';
import { IApiResponse, IPagination, Roles } from '@/common';
import { DoctorDocument } from './schema/doctor.schema';

@ApiTags('Doctors')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiOperation({
    summary: 'Get profile of the logged-in doctor (Doctor only)',
    description: 'Returns profile details of the currently logged-in doctor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor profile retrieved successfully',
  })
  @Get('me')
  @Role(Roles.DOCTOR)
  getMyProfile(@Req() req: CostumeRequest) {
    const userId = req.user!.sub;
    return this.doctorService.findByUserId(new Schema.Types.ObjectId(userId));
  }

  @ApiOperation({
    summary: 'Update profile of the logged-in doctor (Doctor only)',
    description:
      'Allows a doctor to update their personal or professional information.',
  })
  @ApiBody({
    type: UpdateDoctorDto,
    examples: {
      updateDoctorExample: {
        summary: 'Update doctor profile',
        value: {
          contactNumber: '9876543210',
          department: 'Neurology',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor profile updated successfully',
  })
  @Patch('me')
  @Role(Roles.DOCTOR)
  updateMyProfile(
    @Req() req: any,
    @Body() dto: UpdateDoctorDto,
  ): IApiResponse<DoctorDocument> {
    const userId = req.user.userId;
    return this.doctorService.update(dto, new Schema.Types.ObjectId(userId));
  }

  @ApiOperation({
    summary: 'Get details of a specific doctor by ID (Admin only)',
    description:
      'Returns the profile of a doctor based on their ID. Accessible only by Admin.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the doctor',
    example: '64b1234567890abcdef12345',
  })
  @Get(':id')
  @Role(Roles.ADMIN)
  getOneDoc(@Param('id') id: string): IApiResponse<DoctorDocument> {
    return this.doctorService.findByUserId(new Schema.Types.ObjectId(id));
  }

  @ApiOperation({
    summary: 'Get list of all registered doctors (Admin only)',
    description: 'Returns all doctors in the system. Accessible only by Admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'All doctors retrieved successfully',
  })
  @Get('all')
  @Role(Roles.ADMIN)
  getAllDoc(
    @Body() paginationPayload: IPagination,
  ): IApiResponse<DoctorDocument[]> {
    return this.doctorService.findAll(paginationPayload);
  }
}
