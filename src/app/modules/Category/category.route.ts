import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryControllers } from './category.controller';
import { CategoryValidation } from './category.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

router.get('/:categoryId', CategoryControllers.getSingleCategory);

router.patch(
  '/:categoryId',
  validateRequest(CategoryValidation.updateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);

router.get('/', CategoryControllers.getAllCategories);

export const CategoryRoutes = router;
