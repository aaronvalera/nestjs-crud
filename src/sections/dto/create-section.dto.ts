import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsMongoId()
  @IsNotEmpty()
  grade!: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  students?: string[];
}
