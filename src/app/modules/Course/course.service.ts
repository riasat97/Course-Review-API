/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import mongoose from 'mongoose';
import { weeksBetweenDates } from '../../utils/weeksBetweenDates';
import { JwtPayload } from 'jsonwebtoken';

const createCourseIntoDB = async (
  userPayload: JwtPayload,
  payload: TCourse,
) => {
  const { _id: createdBy } = userPayload;
  const result = await Course.create({ createdBy, ...payload });
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const filter: any = {};

  if (query.minPrice)
    filter.price = { $gte: parseFloat(query.minPrice as string) };
  if (query.maxPrice)
    filter.price = {
      ...filter.price,
      $lte: parseFloat(query.maxPrice as string),
    };
  if (query.tags) filter['tags.name'] = query.tags;

  if (query.startDate && query.endDate) {
    filter.startDate = { $gte: query.startDate as string };
    filter.endDate = { $lte: query.endDate as string };
  } else if (query.startDate) {
    filter.startDate = { $gte: query.startDate as string };
  } else if (query.endDate) {
    filter.endDate = { $lte: query.endDate as string };
  }

  if (query.language) filter.language = query.language;
  if (query.provider) filter.provider = query.provider;
  if (query.durationInWeeks)
    filter.durationInWeeks = parseInt(query.durationInWeeks as string);
  if (query.level) filter['details.level'] = query.level;

  const sort: any = {};
  if (query.sortBy) sort[query.sortBy as string] = query.sortOrder || 'asc';

  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const courses = await Course.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'createdBy',
      select: '_id username email role',
    });
  const total = await Course.countDocuments(filter);
  return { page, limit, total, courses };
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate({
    path: 'createdBy',
    select: '_id username email role',
  });
  return result;
};

const getBestCourseFromDB = async () => {
  const coursesWithStats = await Course.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
    {
      $addFields: {
        averageRating: { $avg: '$reviews.rating' },
        reviewCount: { $size: '$reviews' },
      },
    },
    {
      $sort: {
        averageRating: -1,
        reviewCount: -1,
      },
    },
  ]);
  const bestCourse = coursesWithStats[0];
  return bestCourse;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { details, tags, startDate, endDate, ...courseRemainingData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...courseRemainingData,
  };
  const startEndDate = await Course.findById(id).select('startDate endDate');
  if (startEndDate) {
    modifiedUpdatedData['startDate'] = startDate || startEndDate['startDate'];
    modifiedUpdatedData['endDate'] = endDate || startEndDate['endDate'];
    modifiedUpdatedData['durationInWeeks'] = weeksBetweenDates(
      new Date(modifiedUpdatedData['startDate'] as string),
      new Date(modifiedUpdatedData['endDate'] as string),
    );
  }

  if (details && Object.keys(details).length) {
    for (const [key, value] of Object.entries(details)) {
      modifiedUpdatedData[`details.${key}`] = value;
    }
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      modifiedUpdatedData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }

    if (tags && tags.length > 0) {
      const deletedTags = tags
        .filter((el) => el.name && el.isDeleted)
        .map((el) => el.name);

      const deleteTagesFromCourse = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            tags: { name: { $in: deletedTags } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deleteTagesFromCourse) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update tags in course',
        );
      }

      const newTags = tags?.filter((el) => el.name && !el.isDeleted);

      const newTagsToCourse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { tags: { $each: newTags } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newTagsToCourse) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to add tags to course',
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate({
      path: 'createdBy',
      select: '_id username email role',
    });

    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  getBestCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
};
