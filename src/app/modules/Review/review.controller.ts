import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const { ...reviewData } = req.body;
  const result = await ReviewServices.createReviewIntoDB(req.user, reviewData);
  const data = await ReviewServices.getSingleReviewFromDB(result._id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created succesfully',
    data: data,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllReviewsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews are retrieved successfully',
    data: result,
  });
});

const getSingleReview = catchAsync(async (req, res) => {
  // const { facultyId } = req.params;
  // const result = await ReviewServices.getSingleReviewFromDB(facultyId);
  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   message: 'Review retrieved succesfully',
  //   data: result,
  // });
});

const updateReview = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await ReviewServices.updateReviewIntoDB(facultyId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated succesfully',
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
};
