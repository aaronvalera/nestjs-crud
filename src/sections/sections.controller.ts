import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionsPaginationDto } from './dto/sections-pagination.dto';
import { ParseMongoIdPipe } from 'src/utils/pipes/parse-mongo-id.pipe';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  findAll(@Query() sectionsPaginationDto: SectionsPaginationDto) {
    return this.sectionsService.findAll(sectionsPaginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.sectionsService.findOne(id);
  }

  @Post()
  createOne(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.createOne(createSectionDto);
  }

  @Patch(':id')
  partiallyUpdateOne(@Param('id', ParseMongoIdPipe) id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.partiallyUpdateOne(id, updateSectionDto);
  }

  @Put(':id')
  updateOne(@Param('id', ParseMongoIdPipe) id: string, @Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.updateOne(id, createSectionDto);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.sectionsService.deleteOne(id);
  }
}
