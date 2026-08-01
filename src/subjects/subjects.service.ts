import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subject, SubjectDocument } from './entities/subject.entity';
import { Model } from 'mongoose';
import { SubjectsPaginationDto } from './dto/subjects-pagination.dto';

@Injectable()
export class SubjectsService {
  constructor(@InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>) {}

  async findAll(subjectsPaginationDto: SubjectsPaginationDto): Promise<Subject[]> {
    const { name, code, professor } = subjectsPaginationDto;

    const filter: Record<string, any> = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (code) {
      filter.code = { $regex: code, $options: 'i' };
    }

    if (professor) {
      filter.professor = professor;
    }

    return this.subjectModel.find(filter).populate('professor').exec();
  }

  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectModel.findById(id).populate('professor').exec();

    if (!subject) {
      throw new NotFoundException('Subject not found.');
    }

    return subject;
  }

  async createOne(createSubjectDto: CreateSubjectDto) {
    return this.subjectModel.create(createSubjectDto);
  }

  async partiallyUpdateOne(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.subjectModel.findByIdAndUpdate(id, updateSubjectDto, { returnDocument: 'after' }).exec();

    if (!subject) {
      throw new NotFoundException('Subject not found. Could not update it.');
    }

    return subject;
  }

  async updateOne(id: string, createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = await this.subjectModel.findByIdAndUpdate(id, createSubjectDto, { returnDocument: 'after' }).exec();

    if (!subject) {
      throw new NotFoundException('Subject not found. Could not update it.');
    }

    return subject;
  }

  async deleteOne(id: string): Promise<Subject> {
    const subject = await this.subjectModel.findByIdAndDelete(id).exec();

    if (!subject) {
      throw new NotFoundException('Subject not found. Could not delete it.');
    }

    return subject;
  }
}
