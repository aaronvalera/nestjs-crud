import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/students/entities/student.entity';
import { Grade, GradeSchema } from './entities/grade.entity';
import { Section, SectionSchema } from 'src/sections/entities/section.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Grade.name, schema: GradeSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Section.name, schema: SectionSchema },
    ]),
  ],
  controllers: [GradesController],
  providers: [GradesService],
})
export class GradesModule {}
