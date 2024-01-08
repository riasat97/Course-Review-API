import { Types } from 'mongoose';
import { TReview } from './review.interface';
import { Review } from './review.model';
import { JwtPayload } from 'jsonwebtoken';

const createReviewIntoDB = async (
  userPayload: JwtPayload,
  payload: TReview,
) => {
  const { _id: createdBy } = userPayload;
  const result = await Review.create({ createdBy, ...payload });
  return result;
};

const getAllReviewsFromDB = async () => {
  const result = await Review.find();
  return result;
};
const getReviewsByCoursId = async (courseId: Types.ObjectId) => {
  const result = await Review.find({ courseId }).populate({
    path: 'createdBy',
    select: '_id username email role',
  });
  return result;
};
const getSingleReviewFromDB = async (id: Types.ObjectId) => {
  const result = await Review.findById(id).populate({
    path: 'createdBy',
    select: '_id username email role',
  });
  return result;
};

const updateReviewIntoDB = async (id: string, payload: Partial<TReview>) => {
  const result = await Review.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const ReviewServices = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getReviewsByCoursId,
  getSingleReviewFromDB,
  updateReviewIntoDB,
};
