import { Module } from '@nestjs/common';
import { ProfessorsController } from './professors.controller';
import { ProfessorsService } from './professors.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Professor, ProfessorSchema } from './entities/professor.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Professor.name, schema: ProfessorSchema }])],
  controllers: [ProfessorsController],
  providers: [ProfessorsService],
})
export class ProfessorsModule {}
