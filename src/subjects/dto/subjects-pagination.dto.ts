import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

export class SubjectsPaginationDto extends PaginationDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsMongoId()
  @IsOptional()
  professor?: string;
}
