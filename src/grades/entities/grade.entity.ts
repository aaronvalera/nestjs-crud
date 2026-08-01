import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GradeDocument = HydratedDocument<Grade>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Grade {
  @Prop({ required: true, unique: true, trim: true })
  name!: string;

  sections?: unknown[];
  students?: unknown[];
}

export const GradeSchema = SchemaFactory.createForClass(Grade);

GradeSchema.virtual('sections', {
  ref: 'Section',
  localField: '_id',
  foreignField: 'grade',
});

GradeSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'grade',
});
