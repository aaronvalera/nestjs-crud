import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Professor, ProfessorDocument } from './entities/professor.entity';
import { Model } from 'mongoose';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { ProfessorsPaginationDto } from './dto/professors-pagination.dto';

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectModel(Professor.name)
    private professorModel: Model<ProfessorDocument>,
  ) {}

  async findAll(professorPaginationDto: ProfessorsPaginationDto): Promise<Professor[]> {
    const { name } = professorPaginationDto;

    const filter: Record<string, any> = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    return this.professorModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Professor> {
    const professor = await this.professorModel.findById(id).exec();

    if (!professor) {
      throw new NotFoundException('Professor not found.');
    }

    return professor;
  }

  async createOne(createProfessorDto: CreateProfessorDto): Promise<Professor> {
    return this.professorModel.create(createProfessorDto);
  }

  async partiallyUpdateOne(id: string, updateProfessorDto: Partial<CreateProfessorDto>): Promise<Professor> {
    const professor = await this.professorModel
      .findByIdAndUpdate(id, updateProfessorDto, { returnDocument: 'after' })
      .exec();

    if (!professor) {
      throw new NotFoundException('Professor not found. Could not update it.');
    }

    return professor;
  }

  async updateOne(id: string, createProfessorDto: CreateProfessorDto): Promise<Professor> {
    const professor = await this.professorModel
      .findByIdAndUpdate(id, createProfessorDto, { returnDocument: 'after' })
      .exec();

    if (!professor) {
      throw new NotFoundException('Professor not found. Could not update it.');
    }

    return professor;
  }

  async deleteOne(id: string): Promise<Professor> {
    const professor = await this.professorModel.findByIdAndDelete(id).exec();

    if (!professor) {
      throw new NotFoundException('Professor not found. Could not delete it.');
    }

    return professor;
  }
}
