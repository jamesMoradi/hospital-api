import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Patient, PatientDocument } from './schema/patient.schema';
import { Model, Schema } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ApiResponse, IApiResponse, IPagination } from '@/common';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdateSpecialNoteDto } from './dto/update-special-note.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<PatientDocument>,
  ) {}

  async create(
    createPatientDto: CreatePatientDto,
    userId: Schema.Types.ObjectId,
  ): IApiResponse<PatientDocument> {
    const { age, contactNumber, gender, name } = createPatientDto;
    const patient = await this.patientModel.findOne({ userId });
    if (patient)
      return ApiResponse.error(
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        'patient with this id already exists',
      );

    const newPatient = await this.patientModel.create({
      name,
      age,
      gender,
      contactNumber,
      userId,
    });

    if (!newPatient)
      return ApiResponse.error(
        StatusCodes.SERVICE_UNAVAILABLE,
        ReasonPhrases.SERVICE_UNAVAILABLE,
        "Service doesn't response right now",
      );

    return ApiResponse.success(
      StatusCodes.CREATED,
      ReasonPhrases.CREATED,
      '',
      newPatient,
    );
  }

  async findByUSerId(
    userId: Schema.Types.ObjectId,
  ): IApiResponse<PatientDocument> {
    const patient = await this.patientModel.findOne({ userId });

    if (!patient) {
      return ApiResponse.error(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        'no patient with this id exists',
      );
    }

    return ApiResponse.success(StatusCodes.OK, ReasonPhrases.OK, '', patient);
  }

  async findAll(
    paginationPayload: IPagination,
  ): IApiResponse<PatientDocument[]> {
    const { page = 1, pageSize = 10 } = paginationPayload;
    const skip = (page - 1) * pageSize;
    const total = await this.patientModel.countDocuments();
    const patients = await this.patientModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalPages = Math.ceil(total / pageSize);

    return ApiResponse.success(StatusCodes.OK, ReasonPhrases.OK, '', patients, {
      total,
      page,
      pageSize,
      totalPages,
    });
  }

  async remove(userId: Schema.Types.ObjectId): IApiResponse<PatientDocument> {
    const patient = await this.patientModel.findOne({ userId });
    if (!patient)
      return ApiResponse.error(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        'no user with this id exists',
      );
    await this.patientModel.findByIdAndDelete(patient._id);
    return ApiResponse.success(
      StatusCodes.OK,
      ReasonPhrases.OK,
      'patient removed successfully ',
      patient,
    );
  }

  async update(
    updatePatientDto: UpdatePatientDto,
    userId: Schema.Types.ObjectId,
  ): Promise<IApiResponse<PatientDocument>> {
    const { age, contactNumber, gender, name } = updatePatientDto;

    const { code, message, status } = await this.findByUSerId(userId);
    if (status !== StatusCodes.OK) {
      return ApiResponse.error(status, code, message);
    }

    const existedUpdateData: Partial<UpdatePatientDto> = {};

    if (age) existedUpdateData.age = age;
    if (contactNumber) existedUpdateData.contactNumber = contactNumber;
    if (gender) existedUpdateData.gender = gender;
    if (name) existedUpdateData.name = name;

    const updatedPatient = await this.patientModel.findOneAndUpdate(
      { userId },
      existedUpdateData,
      { new: true },
    );

    if (!updatedPatient) {
      return ApiResponse.error(
        StatusCodes.SERVICE_UNAVAILABLE,
        ReasonPhrases.SERVICE_UNAVAILABLE,
        'patient service is not available right now ',
      );
    }

    return ApiResponse.success(
      StatusCodes.ACCEPTED,
      ReasonPhrases.ACCEPTED,
      '',
      updatedPatient,
    );
  }

  async addSpecialNote(
    userId: Schema.Types.ObjectId,
    specialNoteDto: UpdateSpecialNoteDto,
  ): IApiResponse<PatientDocument> {
    const { specialNote } = specialNoteDto;
    const { code, message, status } = await this.findByUSerId(userId);
    if (status !== StatusCodes.OK) {
      return ApiResponse.error(status, code, message);
    }

    const updatedPatient = await this.patientModel.findOneAndUpdate(
      { userId },
      { specialNote },
      { new: true },
    );

    if (!updatedPatient) {
      return ApiResponse.error(
        StatusCodes.SERVICE_UNAVAILABLE,
        ReasonPhrases.SERVICE_UNAVAILABLE,
        'patient service is not available right now ',
      );
    }

    return ApiResponse.success(
      StatusCodes.ACCEPTED,
      ReasonPhrases.ACCEPTED,
      '',
      updatedPatient,
    );
  }
}
