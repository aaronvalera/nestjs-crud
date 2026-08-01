import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfessorDocument = HydratedDocument<Professor>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Professor {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  idCard!: number;

  @Prop({ default: true })
  active!: boolean;
}

export const ProfessorSchema = SchemaFactory.createForClass(Professor);

ProfessorSchema.virtual('subjects', {
  ref: 'Subject',
  localField: '_id',
  foreignField: 'professor',
});
