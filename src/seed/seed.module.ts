import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Grade, GradeSchema } from 'src/grades/entities/grade.entity';
import { Section, SectionSchema } from 'src/sections/entities/section.entity';
import { Student, StudentSchema } from 'src/students/entities/student.entity';
import { Professor, ProfessorSchema } from 'src/professors/entities/professor.entity';
import { Subject, SubjectSchema } from 'src/subjects/entities/subject.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Grade.name, schema: GradeSchema },
      { name: Section.name, schema: SectionSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Professor.name, schema: ProfessorSchema },
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
