import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SectionDocument = HydratedDocument<Section>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Section {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: Types.ObjectId, ref: 'Grade', required: true })
  grade!: Types.ObjectId | string;
}

export const SectionSchema = SchemaFactory.createForClass(Section);

SectionSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'section',
  justOne: false,
});
