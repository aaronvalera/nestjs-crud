import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsPaginationDto } from './dto/subjects-pagination.dto';
import { ParseMongoIdPipe } from 'src/utils/pipes/parse-mongo-id.pipe';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  findAll(@Query() subjectsPaginationDto: SubjectsPaginationDto) {
    return this.subjectsService.findAll(subjectsPaginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.subjectsService.findOne(id);
  }

  @Post()
  createOne(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.createOne(createSubjectDto);
  }

  @Patch(':id')
  partiallyUpdateOne(@Param('id', ParseMongoIdPipe) id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.partiallyUpdateOne(id, updateSubjectDto);
  }

  @Put(':id')
  updateOne(@Param('id', ParseMongoIdPipe) id: string, @Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.updateOne(id, createSubjectDto);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.subjectsService.deleteOne(id);
  }
}
