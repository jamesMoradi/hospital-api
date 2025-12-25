import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor, DoctorDocument } from './schema/doctor.schema';
import { Model, Schema } from 'mongoose';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { IApiResponse, ApiResponse, IPagination } from '@/common/response';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<DoctorDocument>,
  ) {}

  async create(
    createDoctorDto: CreateDoctorDto,
    userId: Schema.Types.ObjectId,
  ): IApiResponse<DoctorDocument> {
    const { age, contactNumber, department, gender, name } = createDoctorDto;

    const doctor = await this.doctorModel.findOne({ userId });
    if (doctor)
      return ApiResponse.error(
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        'doctor with this id already exists',
      );

    const newDoctor = await this.doctorModel.create({
      userId,
      name,
      department,
      gender,
      contactNumber,
      age,
    });

    if (!newDoctor)
      return ApiResponse.error(
        StatusCodes.SERVICE_UNAVAILABLE,
        ReasonPhrases.SERVICE_UNAVAILABLE,
        "doctor service doesn't response right now",
      );

    return ApiResponse.success(
      StatusCodes.CREATED,
      ReasonPhrases.CREATED,
      '',
      newDoctor,
    );
  }

  async findByUserId(
    userId: Schema.Types.ObjectId,
  ): IApiResponse<DoctorDocument> {
    const doctor = await this.doctorModel.findOne({ userId });

    if (!doctor) {
      return ApiResponse.error(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        'no doctor with this id exists',
      );
    }

    return ApiResponse.success(StatusCodes.OK, ReasonPhrases.OK, '', doctor);
  }

  async findAll(
    paginationPayload: IPagination,
  ): IApiResponse<DoctorDocument[]> {
    const { page = 1, pageSize = 10 } = paginationPayload;
    const skip = (page - 1) * pageSize;
    const total = await this.doctorModel.countDocuments();
    const doctors = await this.doctorModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalPages = Math.ceil(total / pageSize);

    return ApiResponse.success(StatusCodes.OK, ReasonPhrases.OK, '', doctors, {
      total,
      page,
      pageSize,
      totalPages,
    });
  }

  async remove(userId: Schema.Types.ObjectId): IApiResponse<DoctorDocument> {
    const doctor = await this.doctorModel.findOne({ userId });
    if (!doctor)
      return ApiResponse.error(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        'no doctor with this id exists',
      );
    await this.doctorModel.findByIdAndDelete(doctor._id);
    return ApiResponse.success(
      StatusCodes.OK,
      ReasonPhrases.OK,
      'doctor removed successfully ',
      doctor,
    );
  }

  async update(
    updateDoctorDto: UpdateDoctorDto,
    userId: Schema.Types.ObjectId,
  ): IApiResponse<DoctorDocument> {
    const { age, contactNumber, gender, name, department } = updateDoctorDto;

    const { code, message, status } = await this.findByUserId(userId);
    if (status !== StatusCodes.OK) {
      return ApiResponse.error(status, code, message);
    }

    const existedUpdateData: Partial<UpdateDoctorDto> = {};

    if (age) existedUpdateData.age = age;
    if (contactNumber) existedUpdateData.contactNumber = contactNumber;
    if (gender) existedUpdateData.gender = gender;
    if (name) existedUpdateData.name = name;
    if (department) existedUpdateData.department = department;

    const updatedDoctor = await this.doctorModel.findOneAndUpdate(
      { userId },
      existedUpdateData,
      { new: true },
    );

    if (!updatedDoctor) {
      return ApiResponse.error(
        StatusCodes.SERVICE_UNAVAILABLE,
        ReasonPhrases.SERVICE_UNAVAILABLE,
        'doctor service is not available right now ',
      );
    }

    return ApiResponse.success(
      StatusCodes.ACCEPTED,
      ReasonPhrases.ACCEPTED,
      '',
      updatedDoctor,
    );
  }
}
