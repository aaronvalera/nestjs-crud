import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsPaginationDto } from './dto/students-pagination.dto';
import { ParseMongoIdPipe } from 'src/utils/pipes/parse-mongo-id.pipe';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(@Query() studentPaginationDto: StudentsPaginationDto) {
    return this.studentsService.findAll(studentPaginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.studentsService.findOne(id);
  }

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createOne(createStudentDto);
  }

  @Patch(':id')
  partiallyUpdateOne(@Param('id', ParseMongoIdPipe) id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.partiallyUpdateOne(id, updateStudentDto);
  }

  @Put(':id')
  updateOne(@Param('id', ParseMongoIdPipe) id: string, @Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.updateOne(id, createStudentDto);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.studentsService.deleteOne(id);
  }
}
