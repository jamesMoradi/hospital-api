import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse, IApiResponse } from '@/common//response';
import * as bcryptjs from 'bcryptjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Roles } from '@/common/enums/role.enum';
import { PatientService } from '../patient/patient.service';
import { PatientDocument } from '../patient/schema/patient.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly patientService: PatientService,
  ) {}

  async findOneByEmail(email: string): IApiResponse<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return ApiResponse.error(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        'no user with this email exists',
      );
    }

    return ApiResponse.success(StatusCodes.OK, ReasonPhrases.OK, '', user);
  }

  async create(
    createUserDto: CreateUserDto,
  ): IApiResponse<UserDocument | PatientDocument> {
    const {
      age,
      contactNumber,
      department,
      email,
      gender,
      name,
      password,
      role,
    } = createUserDto;

    const user = await this.findOneByEmail(email);
    if (user.status === StatusCodes.OK) {
      return ApiResponse.error(
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        'user with this email already exists',
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await this.userModel.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    if (role === Roles.PATIENT) {
      const newPatient = await this.patientService.create(
        {
          name,
          age,
          gender,
          contactNumber,
        },
        newUser._id,
      );

      if (newPatient.status !== StatusCodes.CREATED) {
        return newPatient;
      }
    }

    return ApiResponse.success(
      StatusCodes.CREATED,
      ReasonPhrases.CREATED,
      '',
      newUser,
    );
  }

  async removeById(id: ObjectId): IApiResponse<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user)
      return ApiResponse.error(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        'no user exists',
      );

    await this.userModel.deleteOne(user._id);
    return ApiResponse.success(
      StatusCodes.OK,
      ReasonPhrases.OK,
      'user deleted successfully ',
      user,
    );
  }
}
