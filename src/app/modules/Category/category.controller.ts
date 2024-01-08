import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';

const createCategory = catchAsync(async (req, res) => {
  const { ...categoryData } = req.body;
  const result = await CategoryServices.createCategoryIntoDB(
    req.user,
    categoryData,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created succesfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: { categories: result },
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const result = await CategoryServices.getSingleCategoryFromDB(categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is retrieved succesfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result = await CategoryServices.updateCategoryIntoDB(
    departmentId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is updated succesfully',
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
};
