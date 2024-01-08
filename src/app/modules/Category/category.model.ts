import httpStatus from 'http-status';
import { Schema, model } from 'mongoose';
import AppError from '../../errors/AppError';
import { TCategory } from './category.interface';

const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { versionKey: false, timestamps: true },
);

categorySchema.pre('save', async function (next) {
  const isCategoryExist = await Category.findOne({
    name: this.name,
  });

  if (isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Category is already exist!');
  }
  next();
});

categorySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isCategoryExist = await Category.findOne(query);

  if (!isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Category does not exist! ');
  }

  next();
});

export const Category = model<TCategory>('Category', categorySchema);
