import { GenderEnum } from '@/common/enums/gender.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'John M' })
  @IsString()
  name: string;

  @ApiProperty({ example: 45 })
  @IsNumber()
  @Max(200)
  @Min(0)
  age: number;

  @ApiPropertyOptional({ example: GenderEnum.FEMALE })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiPropertyOptional({ example: '985653223' })
  @IsOptional()
  @IsNumber()
  @IsPhoneNumber()
  contactNumber: number;
}
