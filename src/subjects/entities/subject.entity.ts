import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Professor } from 'src/professors/entities/professor.entity';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  code!: string;

  @Prop({ type: Types.ObjectId, ref: Professor.name, required: true })
  professor!: Types.ObjectId;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
