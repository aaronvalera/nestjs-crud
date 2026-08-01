import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Grade, GradeDocument } from './entities/grade.entity';
import { GradesPaginationDto } from './dto/grades-pagination.dto';
import { Section, SectionDocument } from 'src/sections/entities/section.entity';
import { Student, StudentDocument } from 'src/students/entities/student.entity';

@Injectable()
export class GradesService {
  constructor(
    @InjectModel(Grade.name) private gradeModel: Model<GradeDocument>,
    @InjectModel(Section.name) private readonly sectionModel: Model<SectionDocument>,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
  ) {}

  async findAll(gradesPaginationDto: GradesPaginationDto): Promise<Grade[]> {
    const { name, section, student } = gradesPaginationDto;

    const filter: Record<string, any> = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (section) {
      const sectionDoc = await this.sectionModel.findById(section).select('grade').lean();
      if (!sectionDoc) {
        return [];
      }
      filter._id = new Types.ObjectId(sectionDoc.grade);
    }

    if (student) {
      const studentDoc = await this.studentModel.findById(student).select('grade').lean();
      if (!studentDoc) {
        return [];
      }
      filter._id = new Types.ObjectId(studentDoc.grade);
    }

    return this.gradeModel.find(filter).populate('sections').populate('students').exec();
  }

  async findOne(id: string): Promise<Grade> {
    const grade = await this.gradeModel.findById(id).populate('sections').populate('students').exec();

    if (!grade) {
      throw new NotFoundException('Grade not found.');
    }

    return grade;
  }

  async createOne(createGradeDto: CreateGradeDto): Promise<Grade> {
    return this.gradeModel.create(createGradeDto);
  }

  async partiallyUpdateOne(id: string, updateGradeDto: UpdateGradeDto): Promise<Grade> {
    const grade = await this.gradeModel.findByIdAndUpdate(id, updateGradeDto, { returnDocument: 'after' }).exec();

    if (!grade) {
      throw new NotFoundException('Grade not found. Could not update it.');
    }

    return grade;
  }

  async updateOne(id: string, createGradeDto: CreateGradeDto): Promise<Grade> {
    const grade = await this.gradeModel.findByIdAndUpdate(id, createGradeDto, { returnDocument: 'after' }).exec();

    if (!grade) {
      throw new NotFoundException('Grade not found. Could not update it.');
    }

    return grade;
  }

  async deleteOne(id: string): Promise<Grade> {
    const grade = await this.gradeModel.findByIdAndDelete(id).exec();

    if (!grade) {
      throw new NotFoundException('Grade not found. Could not delete it.');
    }

    return grade;
  }
}
