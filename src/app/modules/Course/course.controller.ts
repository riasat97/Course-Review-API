/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';
import { ReviewServices } from '../Review/review.service';
import { Types } from 'mongoose';

const createCourse = catchAsync(async (req, res) => {
  const { ...courseData } = req.body;
  const result = await CourseServices.createCourseIntoDB(req.user, courseData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created succesfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const { page, limit, total, courses } =
    await CourseServices.getAllCoursesFromDB(req.query);
  const meta = { page, limit, total };

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course are retrieved successfully',
    meta: meta,
    data: { courses: courses },
  });
});

const getSingleCourseWithReviews = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(courseId);
  const courseDocument = result?.toObject({ getters: true }) as {
    [key: string]: any;
  };
  delete courseDocument?.id;
  const courseReviews = await ReviewServices.getReviewsByCoursId(
    new Types.ObjectId(courseId),
  );
  const courseWithReviews = {
    course: { ...courseDocument },
    reviews: courseReviews,
  };
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course and Reviews retrieved successfully',
    data: courseWithReviews,
  });
});

const getBestCourse = catchAsync(async (req, res) => {
  const bestCourse = await CourseServices.getBestCourseFromDB();
  const course = await CourseServices.getSingleCourseFromDB(bestCourse._id);

  const bestaCourseCopy = { ...bestCourse };
  delete bestaCourseCopy.averageRating;
  delete bestaCourseCopy.reviewCount;
  delete bestaCourseCopy.reviews;
  const result = {
    course: course,
    averageRating: bestCourse.averageRating,
    reviewCount: bestCourse.reviewCount,
  };
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best course retrieved successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.updateCourseIntoDB(courseId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'course updated succesfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted succesfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getSingleCourseWithReviews,
  getBestCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
};
