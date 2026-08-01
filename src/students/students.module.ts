import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './entities/student.entity';
import { Grade, GradeSchema } from 'src/grades/entities/grade.entity';
import { Section, SectionSchema } from 'src/sections/entities/section.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Grade.name, schema: GradeSchema },
      { name: Section.name, schema: SectionSchema },
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
