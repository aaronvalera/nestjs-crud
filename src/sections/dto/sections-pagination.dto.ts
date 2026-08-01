import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

export class SectionsPaginationDto extends PaginationDto {
  @IsMongoId()
  @IsOptional()
  grade?: string;

  @IsMongoId()
  @IsOptional()
  student?: string;
}
