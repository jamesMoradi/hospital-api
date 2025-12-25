import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/common/auth/role.guard';
import { Role } from '@/common/auth/role.decorator';
import { IApiResponse, Roles } from '@/common';
import { UserDocument } from './schema/user.schema';
import { Schema } from 'mongoose';
import { PatientDocument } from '../patient/schema/patient.schema';
import { DoctorDocument } from '../doctor/schema/doctor.schema';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Register a new user (accessible to Admin only)',
    description: `Use this endpoint to register a new user as either a doctor or a patient.

    ✳️ Common fields (for both):
    - name
    - age
    - gender
    - contactNumber
    - email
    - password

    🧑‍⚕️ Additional field for Doctor:
    - department

    🧍 Patient does not require department.`,
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      DoctorExample: {
        summary: 'Register a Doctor',
        value: {
          name: 'Test Doctor1',
          email: 'doctor1@test.com',
          password: 'doctor123',
          role: 'doctor',
          gender: 'male',
          department: 'Orthopaedics',
          contactNumber: 7800000011,
        },
      },
      PatientExample: {
        summary: 'Register a Patient',
        value: {
          name: 'Test Patient1',
          email: 'patient1@test.com',
          password: 'patient123',
          role: 'patient',
          age: 20,
          gender: 'Male',
          contactNumber: 7000000001,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 401,
    description: 'UnAuthorized. Only Admin can register users.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only Admin can register users.',
  })
  @Post('register')
  @Role(Roles.ADMIN)
  async register(
    @Body() signupDto: CreateUserDto,
  ): IApiResponse<UserDocument | PatientDocument | DoctorDocument> {
    return this.userService.create(signupDto);
  }

  @ApiOperation({ summary: 'Delete a patient or doctor by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the user to delete',
    example: '64b1234567890abcdef12345',
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({
    status: 401,
    description: 'UnAuthorized. Only Admin can delete users.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only Admin can delete users.',
  })
  @Delete(':id')
  @Role(Roles.ADMIN)
  removePatient(
    @Param('id') id: string,
  ): IApiResponse<PatientDocument | DoctorDocument> {
    return this.userService.removeById(new Schema.Types.ObjectId(id));
  }
}
