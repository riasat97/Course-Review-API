import { Schema, model } from 'mongoose';
import { CourseLevel, TCourse, TDetails, TTags } from './course.interface';
import { weeksBetweenDates } from '../../utils/weeksBetweenDates';

const tagsSchema = new Schema<TTags>(
  {
    name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const detailsSchema = new Schema<TDetails>(
  {
    level: {
      type: String,
      enum: {
        values: Object.values(CourseLevel),
        message: '{VALUE} is not a valid level',
      },
      required: true,
    },
    description: { type: String, required: true },
  },
  {
    _id: false,
  },
);

const courseSchema = new Schema<TCourse>(
  {
    title: { type: String, unique: true, required: true },
    instructor: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: { type: Number, required: true },
    tags: { type: [tagsSchema], required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    language: { type: String, required: true },
    provider: { type: String, required: true },
    details: { type: detailsSchema, required: true },
    durationInWeeks: { type: Number },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
        delete ret.__v;
      },
    },
    versionKey: false,
    timestamps: true,
  },
);

// courseSchema.virtual('durationInWeeks').get(function () {
//   const durationInWeeks = weeksBetweenDates(
//     new Date(this.startDate),
//     new Date(this.endDate),
//   );
//   return durationInWeeks;
// });

courseSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const course = this; // doc
  course.durationInWeeks = weeksBetweenDates(
    new Date(this.startDate),
    new Date(this.endDate),
  );
  next();
});

export const Course = model<TCourse>('Course', courseSchema);
