import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradesPaginationDto } from './dto/grades-pagination.dto';
import { ParseMongoIdPipe } from 'src/utils/pipes/parse-mongo-id.pipe';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  findAll(@Query() gradesPaginationDto: GradesPaginationDto) {
    return this.gradesService.findAll(gradesPaginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.gradesService.findOne(id);
  }

  @Post()
  createOne(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.createOne(createGradeDto);
  }

  @Patch(':id')
  partiallyUpdateOne(@Param('id', ParseMongoIdPipe) id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.partiallyUpdateOne(id, updateGradeDto);
  }

  @Put(':id')
  updateOne(@Param('id', ParseMongoIdPipe) id: string, @Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.updateOne(id, createGradeDto);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.gradesService.deleteOne(id);
  }
}
