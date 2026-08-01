import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { ParseMongoIdPipe } from '../utils/pipes/parse-mongo-id.pipe';
import { ProfessorsPaginationDto } from './dto/professors-pagination.dto';

@Controller('professors')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Get()
  findAll(@Query() professorsPaginationDto: ProfessorsPaginationDto) {
    return this.professorsService.findAll(professorsPaginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.professorsService.findOne(id);
  }

  @Post()
  createOne(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorsService.createOne(createProfessorDto);
  }

  @Patch(':id')
  partiallyUpdateOne(@Param('id', ParseMongoIdPipe) id: string, @Body() updateProfessorDto: UpdateProfessorDto) {
    return this.professorsService.partiallyUpdateOne(id, updateProfessorDto);
  }

  @Put(':id')
  updateOne(@Param('id', ParseMongoIdPipe) id: string, @Body() createProfessorDto: CreateProfessorDto) {
    return this.professorsService.updateOne(id, createProfessorDto);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.professorsService.deleteOne(id);
  }
}
