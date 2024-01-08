import { Router } from 'express';
import { CourseRoutes } from '../modules/Course/course.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { ReviewRoutes } from '../modules/Review/review.route';
import { AuthRoutes } from '../modules/Auth/auth.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/',
    route: CourseRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
