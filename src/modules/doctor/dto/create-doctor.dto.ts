import { GenderEnum } from '@/common/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ example: 'John M' })
  @IsString()
  name: string;

  @ApiProperty({ example: 51 })
  @IsNumber()
  @Max(200)
  @Min(1)
  age: number;

  @ApiProperty({ example: GenderEnum.FEMALE })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ example: 'Ortho' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: '9764321512' })
  @IsNumber()
  @IsPhoneNumber()
  contactNumber: number;
}
