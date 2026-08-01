import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, SectionSchema } from './entities/section.entity';
import { Student, StudentSchema } from 'src/students/entities/student.entity';
import { Grade, GradeSchema } from 'src/grades/entities/grade.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Section.name, schema: SectionSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Grade.name, schema: GradeSchema },
    ]),
  ],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
