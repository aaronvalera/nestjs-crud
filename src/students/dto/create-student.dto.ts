import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  idCard!: number;

  @IsMongoId()
  @IsNotEmpty()
  grade!: string;

  @IsMongoId()
  @IsNotEmpty()
  section!: string;
}
