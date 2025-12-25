import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IApiResponse } from '@/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @ApiOperation({
    summary: 'User Login',
    description: `Use this endpoint to log in using email and password. 
    On success, it returns a JWT token to be used in protected routes.`,
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      adminLogin: {
        summary: 'Admin login (for testing)',
        value: {
          email: 'admin@test.com',
          password: 'admin123',
        },
      },
      doctorLogin: {
        summary: 'Docotor login(for testing)',
        value: {
          email: 'doctor@test.com',
          password: 'doctor123',
        },
      },
      patientLogin: {
        summary: 'Patient login(for testing)',
        value: {
          email: 'patient@test.com',
          password: 'patient123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful. JWT token returned.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid email or password.',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto): IApiResponse<string> {
    return this.authservice.login(loginDto);
  }
}
