import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './entities/student.entity';
import { Model, Types } from 'mongoose';
import { StudentsPaginationDto } from './dto/students-pagination.dto';
import { Section } from 'src/sections/entities/section.entity';
import { MongoServerError } from 'mongodb';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Section.name) private readonly sectionModel: Model<Section>,
  ) {}

  async findAll(studentPaginationDto: StudentsPaginationDto): Promise<Student[]> {
    const { name, grade, section } = studentPaginationDto;

    const filter: Record<string, any> = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (grade) {
      filter.grade = new Types.ObjectId(grade);
    }

    if (section) {
      filter.section = new Types.ObjectId(section);
    }

    return this.studentModel.find(filter).populate('grade').populate('section').exec();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).populate('grade').populate('section').exec();

    if (!student) {
      throw new NotFoundException('Student not found.');
    }

    return student;
  }

  async createOne(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const newStudent = await this.studentModel.create(createStudentDto);
      const student = await this.studentModel.findById(newStudent._id).populate('grade').populate('section').exec();

      if (!student) {
        throw new NotFoundException('Student not found after creation.');
      }

      return student;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new BadRequestException('A student with that idCard already exists.');
      }
      throw error;
    }
  }

  async partiallyUpdateOne(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, { returnDocument: 'after' }).exec();

    if (!student) {
      throw new NotFoundException('Student not found. Could not update it.');
    }

    return student;
  }

  async updateOne(id: string, createStudentDto: CreateStudentDto): Promise<Student> {
    const student = await this.studentModel.findByIdAndUpdate(id, createStudentDto, { returnDocument: 'after' }).exec();

    if (!student) {
      throw new NotFoundException('Student not found. Could not update it.');
    }

    return student;
  }

  async deleteOne(id: string): Promise<Student> {
    const student = await this.studentModel.findByIdAndDelete(id).exec();

    if (!student) {
      throw new NotFoundException('Student not found. Could not delete it.');
    }

    return student;
  }
}
