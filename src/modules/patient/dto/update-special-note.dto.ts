import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSpecialNoteDto {
  @ApiProperty({ example: 'Health condition is too bad.' })
  @IsString()
  @IsNotEmpty()
  specialNote: string;
}
