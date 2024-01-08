import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/course',
  auth('admin'),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/courses/:courseId/reviews',
  CourseControllers.getSingleCourseWithReviews,
);
router.get('/course/best', CourseControllers.getBestCourse);

router.put(
  '/courses/:courseId',
  auth('admin'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete('/:id', CourseControllers.deleteCourse);

router.get('/courses', CourseControllers.getAllCourses);

export const CourseRoutes = router;
