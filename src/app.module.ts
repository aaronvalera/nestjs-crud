import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessorsModule } from './professors/professors.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubjectsModule } from './subjects/subjects.module';
import { StudentsModule } from './students/students.module';
import { GradesModule } from './grades/grades.module';
import { SectionsModule } from './sections/sections.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        uri: ConfigService.get<string>('MONGO_URI'),
      }),
    }),

    ProfessorsModule,

    SubjectsModule,

    StudentsModule,

    GradesModule,

    SectionsModule,

    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
