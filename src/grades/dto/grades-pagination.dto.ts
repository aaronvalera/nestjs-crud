import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

export class GradesPaginationDto extends PaginationDto {
  @IsMongoId()
  @IsOptional()
  section?: string;

  @IsMongoId()
  @IsOptional()
  student?: string;
}
