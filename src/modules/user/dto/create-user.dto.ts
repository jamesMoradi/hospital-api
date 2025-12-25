import { Roles } from '@/common';
import { GenderEnum } from '@/common/enums/gender.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John M' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@gmil.com' })
  @IsEmail({}, { message: 'Please Enter Correct Email' })
  email: string;

  @ApiProperty({ example: 'Abcabc123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'doctor' })
  @IsEnum(Roles)
  role: Roles;

  @ApiPropertyOptional({ example: '23' })
  @IsNumber()
  age: number;

  @ApiPropertyOptional({ example: GenderEnum.MALE })
  @IsString()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiPropertyOptional({ example: 'Ortho' })
  @IsString()
  @IsOptional()
  department: string;

  @ApiPropertyOptional({ example: '985653223' })
  @IsNumber()
  @IsPhoneNumber()
  contactNumber: number;
}
