import { JwtPayload } from 'jsonwebtoken';
import { TCategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDB = async (
  userPayload: JwtPayload,
  payload: TCategory,
) => {
  const { _id: createdBy } = userPayload;
  const result = await Category.create({ createdBy, ...payload });
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await Category.find().populate({
    path: 'createdBy',
    select: '_id username email role',
  });
  return result;
};

const getSingleCategoryFromDB = async (id: string) => {
  const result = await Category.findById(id);
  return result;
};

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<TCategory>,
) => {
  const result = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
};
