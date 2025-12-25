import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse, IApiResponse, Roles } from '@/common';
import { User, UserDocument, UserModel } from './schema/user.schema';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { ObjectId } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async findByEmailId(email: string): IApiResponse<UserDocument> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return ApiResponse.error(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        'No user with this email exists',
      );
    }

    return ApiResponse.success(StatusCodes.OK, ReasonPhrases.OK, '', user);
  }

  async create(createUSerDto: CreateUserDto): IApiResponse<UserDocument> {
    const { email, gender, name, password, role } = createUSerDto;
    const isUserEXists = await this.userModel.findOne({ email });

    if (isUserEXists)
      return ApiResponse.error(
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        'user with this email already exists',
      );

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user: UserDocument = await this.userModel.create({
      password: hashedPassword,
      name,
      email,
      gender,
      role,
    });

    // if (user.role === Roles.PATIENT) {
    // } else if (user.role === Roles.DOCTOR) {
    //   pass
    // }

    return ApiResponse.success(StatusCodes.OK, ReasonPhrases.OK, '', user);
  }

  async remove(id: ObjectId): IApiResponse<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user)
      return ApiResponse.error(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        'no user exists',
      );

    return ApiResponse.success(StatusCodes.OK, ReasonPhrases.OK, '', user);
  }
}
