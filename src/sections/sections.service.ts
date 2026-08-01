import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Section, SectionDocument } from './entities/section.entity';
import { Student, StudentDocument } from 'src/students/entities/student.entity';
import { Model, Types } from 'mongoose';
import { SectionsPaginationDto } from './dto/sections-pagination.dto';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
  ) {}

  async findAll(sectionsPaginationDto: SectionsPaginationDto) {
    const { name, grade, student } = sectionsPaginationDto;

    const filter: Record<string, any> = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (grade) {
      filter.grade = grade;
    }

    if (student) {
      const studentDoc = await this.studentModel.findById(student).select('section').lean();
      if (!studentDoc) {
        return [];
      }
      filter._id = new Types.ObjectId(studentDoc.section);
    }

    const sections = await this.sectionModel.find(filter).populate('grade').exec();
    const sectionIds = sections.map((section) => section._id);
    const sectionIdStrings = sectionIds.map((id) => id.toString());
    const students = await this.studentModel.find({ section: { $in: [...sectionIds, ...sectionIdStrings] } }).exec();

    return sections.map((section) => {
      const sectionObj = section.toObject({ virtuals: true });
      return {
        ...sectionObj,
        students: students.filter((studentDoc) => {
          const sectionValue = studentDoc.section;
          return sectionValue && (sectionValue.toString ? sectionValue.toString() : sectionValue) === section._id.toString();
        }),
      };
    }) as Section[];
  }

  async findOne(id: string): Promise<Section> {
    const section = await this.sectionModel.findById(id).populate('grade').exec();

    if (!section) {
      throw new NotFoundException('Section not found.');
    }

    const students = await this.studentModel.find({ section: { $in: [section._id, section._id.toString()] } }).exec();
    const sectionObj = section.toObject({ virtuals: true });
    return {
      ...sectionObj,
      students,
    } as Section;
  }

  async createOne(createSectionDto: CreateSectionDto): Promise<Section> {
    return this.sectionModel.create(createSectionDto);
  }

  async partiallyUpdateOne(id: string, updateSectionDto: UpdateSectionDto): Promise<Section> {
    const section = await this.sectionModel.findByIdAndUpdate(id, updateSectionDto, { returnDocument: 'after' }).exec();

    if (!section) {
      throw new NotFoundException('Section not found. Could not update it.');
    }

    return section;
  }

  async updateOne(id: string, createSectionDto: CreateSectionDto): Promise<Section> {
    const section = await this.sectionModel.findByIdAndUpdate(id, createSectionDto, { returnDocument: 'after' }).exec();

    if (!section) {
      throw new NotFoundException('Section not found. Could not update it.');
    }

    return section;
  }

  async deleteOne(id: string): Promise<Section> {
    const section = await this.sectionModel.findByIdAndDelete(id).exec();

    if (!section) {
      throw new NotFoundException('Section not found. Could not delete it.');
    }

    return section;
  }
}
