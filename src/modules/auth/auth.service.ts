import { ApiResponse, IApiResponse } from '@/common/response';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { UserDocument } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { Roles } from '@common/enums/role.enum';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private userServices: UserService,
    private jwtServices: JwtService,
    @Inject() private readonly request: Request,
  ) {}

  private async validateUser(
    email: string,
    password: string,
  ): IApiResponse<UserDocument> {
    const { status, data: user } =
      await this.userServices.findOneByEmail(email);

    if (status !== StatusCodes.OK)
      return ApiResponse.error(
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
        'Email is not registered',
      );

    const passwordMatches = await bcryptjs.compare(password, user!.password);
    if (!passwordMatches)
      return ApiResponse.error(
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
        'invalid password',
      );

    return ApiResponse.success(StatusCodes.OK, ReasonPhrases.OK, '', user!);
  }

  async login(loginDto: LoginDto): IApiResponse<string> {
    const { email, password } = loginDto;
    const {
      code,
      message,
      status,
      data: user,
    } = await this.validateUser(email, password);

    if (status !== StatusCodes.OK) {
      return ApiResponse.error(status, code, message);
    }

    const token = this.jwtServices.sign({
      email: user?.email,
      sub: user?._id,
      role: user?.role,
    });

    const prefix = user?.role === Roles.DOCTOR ? 'dr' : '';

    return ApiResponse.success(
      StatusCodes.ACCEPTED,
      ReasonPhrases.ACCEPTED,
      `welcome dear ${prefix} ${user?.name}`,
      token,
    );
  }
}
