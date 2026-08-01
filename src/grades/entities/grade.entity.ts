import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GradeDocument = HydratedDocument<Grade>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Grade {
  @Prop({ required: true, unique: true, trim: true })
  name!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Section' }], default: [] })
  students!: Types.ObjectId[];
}

export const GradeSchema = SchemaFactory.createForClass(Grade);

GradeSchema.virtual('sections', {
  ref: 'Section',
  localField: '_id',
  foreignField: 'grade',
});
