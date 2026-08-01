import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grade, GradeDocument } from 'src/grades/entities/grade.entity';
import { Section, SectionDocument } from 'src/sections/entities/section.entity';
import { Student, StudentDocument } from 'src/students/entities/student.entity';
import { Subject, SubjectDocument } from 'src/subjects/entities/subject.entity';
import { Professor, ProfessorDocument } from 'src/professors/entities/professor.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Grade.name) private readonly gradeModel: Model<GradeDocument>,
    @InjectModel(Section.name) private readonly sectionModel: Model<SectionDocument>,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
    @InjectModel(Subject.name) private readonly subjectModel: Model<SubjectDocument>,
    @InjectModel(Professor.name) private readonly professorModel: Model<ProfessorDocument>,
  ) {}

  async runSeed() {
    await Promise.all([
      this.studentModel.deleteMany({}),
      this.sectionModel.deleteMany({}),
      this.gradeModel.deleteMany({}),
      this.subjectModel.deleteMany({}),
      this.professorModel.deleteMany({}),
    ]);

    const gradeNames = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'];
    const createdGrades = await this.gradeModel.insertMany(gradeNames.map((name) => ({ name })));

    const usedIdCards = new Set<number>();
    const getUniqueIdCard = (min: number, max: number) => {
      let idCard: number;
      do {
        idCard = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (usedIdCards.has(idCard));

      usedIdCards.add(idCard);
      return idCard;
    };

    const professorsData = Array.from({ length: 8 }).map(() => ({
      name: `Professor ${Math.random().toString(36).substring(2, 8)}`,
      idCard: getUniqueIdCard(10000000, 29999999),
    }));
    const createdProfessors = await this.professorModel.insertMany(professorsData);

    const subjectList = [
      { name: 'Mathematics', code: 'MATH-101' },
      { name: 'Physics', code: 'PHYS-101' },
      { name: 'Chemistry', code: 'CHEM-101' },
      { name: 'Biology', code: 'BIOL-101' },
      { name: 'History', code: 'HIST-101' },
      { name: 'Geography', code: 'GEOG-101' },
      { name: 'Literature', code: 'LIT-101' },
      { name: 'English', code: 'ENG-101' },
    ];

    const subjectsData = subjectList.map((subject, index) => ({
      name: subject.name,
      code: subject.code,
      professor: createdProfessors[index % createdProfessors.length]._id,
    }));

    const createdSubjects = await this.subjectModel.insertMany(subjectsData);

    const createdSections: SectionDocument[] = [];
    let totalStudentsCreated = 0;

    for (const grade of createdGrades) {
      const sectionLetters = ['A', 'B'];

      for (const letter of sectionLetters) {
        const section = await this.sectionModel.create({
          name: letter,
          grade: grade._id,
        });

        const studentsCount = Math.floor(Math.random() * 6) + 10;
        const studentsData = Array.from({ length: studentsCount }).map(() => ({
          name: `Student ${Math.random().toString(36).substring(2, 8)}`,
          idCard: getUniqueIdCard(20000000, 34999999),
          grade: grade._id,
          section: section._id,
        }));

        const insertedStudents = await this.studentModel.insertMany(studentsData);

        createdSections.push(section);
        totalStudentsCreated += insertedStudents.length;
      }
    }

    return {
      message: 'Database seeded successfully.',
      summary: {
        grades: createdGrades.length,
        subjects: createdSubjects.length,
        professor: createdProfessors.length,
        sections: createdSections.length,
        students: totalStudentsCreated,
      },
    };
  }
}
