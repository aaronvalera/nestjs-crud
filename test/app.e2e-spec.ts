/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TransformInterceptor } from '../src/utils/transform/transform.interceptor';

jest.setTimeout(30000);

describe('API (e2e)', () => {
  let app: INestApplication;
  let server: any;

  const createRandomNumber = () => Math.floor(10000000 + Math.random() * 80000000);
  const createRandomString = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const expectWrapped = (res: request.Response, status: number) => {
    expect(res.status).toBe(status);
    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: status,
        message: expect.any(String),
        data: expect.anything(),
      }),
    );
    return res.body.data;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) should return Hello World!', async () => {
    const res = await request(server).get('/');
    const data = expectWrapped(res, 200);
    expect(data).toBe('Hello World!');
  });

  describe('Professors', () => {
    let professorId: string;
    const professorName = createRandomString('prof');
    const professorPayload = { name: professorName, idCard: createRandomNumber() };

    it('POST /professors should create a professor', async () => {
      const res = await request(server).post('/professors').send(professorPayload);
      const data = expectWrapped(res, 201);
      expect(data).toMatchObject({ name: professorName, idCard: professorPayload.idCard, active: true });
      professorId = data._id;
    });

    it('GET /professors should return professors and filter by name', async () => {
      const res = await request(server)
        .get('/professors')
        .query({ name: professorName.substring(0, 4) });
      const data = expectWrapped(res, 200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.some((item: any) => item._id === professorId)).toBe(true);
    });

    it('GET /professors/:id should return the created professor', async () => {
      const res = await request(server).get(`/professors/${professorId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(professorId);
      expect(data.name).toBe(professorName);
    });

    it('PATCH /professors/:id should update the professor', async () => {
      const res = await request(server).patch(`/professors/${professorId}`).send({ active: false });
      const data = expectWrapped(res, 200);
      expect(data.active).toBe(false);
    });

    it('PUT /professors/:id should replace the professor', async () => {
      const replacement = { name: createRandomString('prof-edit'), idCard: createRandomNumber() };
      const res = await request(server).put(`/professors/${professorId}`).send(replacement);
      const data = expectWrapped(res, 200);
      expect(data.name).toBe(replacement.name);
      expect(data.idCard).toBe(replacement.idCard);
    });

    it('GET /professors/:id invalid id returns 400', async () => {
      const res = await request(server).get('/professors/invalid-id');
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ statusCode: 400, message: expect.any(String) });
    });

    it('DELETE /professors/:id should remove the professor', async () => {
      const res = await request(server).delete(`/professors/${professorId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(professorId);
    });
  });

  describe('Grades', () => {
    let gradeId: string;
    const gradeName = createRandomString('grade');

    it('POST /grades should create a grade', async () => {
      const res = await request(server).post('/grades').send({ name: gradeName });
      const data = expectWrapped(res, 201);
      expect(data.name).toBe(gradeName);
      gradeId = data._id;
    });

    it('GET /grades should return grades and filter by name', async () => {
      const res = await request(server)
        .get('/grades')
        .query({ name: gradeName.substring(0, 4) });
      const data = expectWrapped(res, 200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.some((item: any) => item._id === gradeId)).toBe(true);
    });

    it('GET /grades/:id should return the grade', async () => {
      const res = await request(server).get(`/grades/${gradeId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(gradeId);
    });

    it('PATCH /grades/:id should update the grade', async () => {
      const updatedName = createRandomString('grade-update');
      const res = await request(server).patch(`/grades/${gradeId}`).send({ name: updatedName });
      const data = expectWrapped(res, 200);
      expect(data.name).toBe(updatedName);
    });

    it('PUT /grades/:id should replace the grade', async () => {
      const replacementName = createRandomString('grade-replace');
      const res = await request(server).put(`/grades/${gradeId}`).send({ name: replacementName });
      const data = expectWrapped(res, 200);
      expect(data.name).toBe(replacementName);
    });

    it('GET /grades/:id missing grade returns 404', async () => {
      const res = await request(server).get('/grades/613b1f1e1f1e1f1e1f1e1f1e');
      expect(res.status).toBe(404);
    });

    it('DELETE /grades/:id should remove the grade', async () => {
      const res = await request(server).delete(`/grades/${gradeId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(gradeId);
    });
  });

  describe('Sections and Students', () => {
    let gradeId: string;
    let sectionId: string;
    let studentId: string;

    it('creates a grade for section and student', async () => {
      const gradeName = createRandomString('section-grade');
      const res = await request(server).post('/grades').send({ name: gradeName });
      const data = expectWrapped(res, 201);
      gradeId = data._id;
    });

    it('POST /sections should create a section', async () => {
      const res = await request(server)
        .post('/sections')
        .send({ name: createRandomString('section'), grade: gradeId });
      const data = expectWrapped(res, 201);
      expect(data.name).toContain('section');
      expect(data.grade).toBe(gradeId);
      sectionId = data._id;
    });

    it('POST /students should create a student for section filter', async () => {
      const studentPayload = {
        name: createRandomString('student'),
        idCard: createRandomNumber(),
        grade: gradeId,
        section: sectionId,
      };
      const res = await request(server).post('/students').send(studentPayload);
      const data = expectWrapped(res, 201);
      expect(data.name).toBe(studentPayload.name);
      expect(data.grade._id || data.grade).toBe(gradeId);
      expect(data.section._id || data.section).toBe(sectionId);
      studentId = data._id;
    });

    it('GET /sections?student= should filter by student section', async () => {
      const res = await request(server).get('/sections').query({ student: studentId });
      const data = expectWrapped(res, 200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0]._id).toBe(sectionId);
    });

    it('GET /grades?student= should filter by the student grade', async () => {
      const res = await request(server).get('/grades').query({ student: studentId });
      const data = expectWrapped(res, 200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.some((item: any) => item._id === gradeId)).toBe(true);
    });

    it('GET /sections?grade= should filter by grade', async () => {
      const res = await request(server).get('/sections').query({ grade: gradeId });
      const data = expectWrapped(res, 200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.some((item: any) => item._id?.toString() === sectionId.toString())).toBe(true);
    });

    it('GET /students?grade= should return the student', async () => {
      const res = await request(server).get('/students').query({ grade: gradeId });
      const data = expectWrapped(res, 200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.some((item: any) => item._id === studentId)).toBe(true);
    });

    it('GET /students?section= should return the student', async () => {
      const res = await request(server).get('/students').query({ section: sectionId });
      const data = expectWrapped(res, 200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.some((item: any) => item._id === studentId)).toBe(true);
    });

    it('GET /students/:id should return the student', async () => {
      const res = await request(server).get(`/students/${studentId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(studentId);
    });

    it('PATCH /students/:id should update the student', async () => {
      const newName = createRandomString('student-patch');
      const res = await request(server).patch(`/students/${studentId}`).send({ name: newName });
      const data = expectWrapped(res, 200);
      expect(data.name).toBe(newName);
    });

    it('PUT /students/:id should replace the student', async () => {
      const replacement = {
        name: createRandomString('student-put'),
        idCard: createRandomNumber(),
        grade: gradeId,
        section: sectionId,
      };
      const res = await request(server).put(`/students/${studentId}`).send(replacement);
      const data = expectWrapped(res, 200);
      expect(data.name).toBe(replacement.name);
      expect(data.idCard).toBe(replacement.idCard);
    });

    it('DELETE /students/:id should remove the student', async () => {
      const res = await request(server).delete(`/students/${studentId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(studentId);
    });

    it('DELETE /sections/:id should remove the section', async () => {
      const res = await request(server).delete(`/sections/${sectionId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(sectionId);
    });

    it('DELETE /grades/:id should remove the grade', async () => {
      const res = await request(server).delete(`/grades/${gradeId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(gradeId);
    });
  });

  describe('Subjects', () => {
    let professorId: string;
    let subjectId: string;
    const professorPayload = { name: createRandomString('prof-sub'), idCard: createRandomNumber() };

    it('POST /professors should create the subject professor', async () => {
      const res = await request(server).post('/professors').send(professorPayload);
      const data = expectWrapped(res, 201);
      professorId = data._id;
    });

    it('POST /subjects should create a subject', async () => {
      const subjectPayload = {
        name: createRandomString('subject'),
        code: createRandomString('code'),
        professor: professorId,
      };
      const res = await request(server).post('/subjects').send(subjectPayload);
      const data = expectWrapped(res, 201);
      expect(data.name).toBe(subjectPayload.name);
      expect(data.code).toBe(subjectPayload.code);
      expect(data.professor).toBe(subjectId ? subjectId : professorId);
      subjectId = data._id;
    });

    it('GET /subjects should return subjects and filter by professor', async () => {
      const res = await request(server).get('/subjects').query({ professor: professorId });
      const data = expectWrapped(res, 200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.some((item: any) => item._id === subjectId)).toBe(true);
    });

    it('GET /subjects/:id should return the subject', async () => {
      const res = await request(server).get(`/subjects/${subjectId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(subjectId);
    });

    it('PATCH /subjects/:id should update the subject', async () => {
      const newName = createRandomString('subject-patch');
      const res = await request(server).patch(`/subjects/${subjectId}`).send({ name: newName });
      const data = expectWrapped(res, 200);
      expect(data.name).toBe(newName);
    });

    it('PUT /subjects/:id should replace the subject', async () => {
      const payload = {
        name: createRandomString('subject-put'),
        code: createRandomString('code-put'),
        professor: professorId,
      };
      const res = await request(server).put(`/subjects/${subjectId}`).send(payload);
      const data = expectWrapped(res, 200);
      expect(data.name).toBe(payload.name);
      expect(data.code).toBe(payload.code);
    });

    it('DELETE /subjects/:id should remove the subject', async () => {
      const res = await request(server).delete(`/subjects/${subjectId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(subjectId);
    });

    it('DELETE /professors/:id should remove the professor', async () => {
      const res = await request(server).delete(`/professors/${professorId}`);
      const data = expectWrapped(res, 200);
      expect(data._id).toBe(professorId);
    });
  });
});
