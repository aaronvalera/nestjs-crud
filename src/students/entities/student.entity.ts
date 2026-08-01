import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  idCard!: number;

  @Prop({ type: Types.ObjectId, ref: 'Grade', required: true })
  grade!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Section', required: true })
  section!: Types.ObjectId;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
