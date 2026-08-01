import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGradeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsMongoId({ each: true })
  @IsArray()
  @IsOptional()
  sections?: string[];

  @IsMongoId({ each: true })
  @IsArray()
  @IsOptional()
  students?: string[];
}
