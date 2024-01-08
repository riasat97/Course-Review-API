import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewControllers } from './review.controller';
import { ReviewValidation } from './review.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewControllers.createReview,
);

router.get('/:reviewId', ReviewControllers.getSingleReview);

router.patch(
  '/:reviewId',
  validateRequest(ReviewValidation.updateReviewValidationSchema),
  ReviewControllers.updateReview,
);

router.get('/', ReviewControllers.getAllReviews);

export const ReviewRoutes = router;
