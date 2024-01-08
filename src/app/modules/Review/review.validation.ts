import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    courseId: z.string({ required_error: 'Course ID is required' }),
    rating: z
      .number({ required_error: 'Rating is required' })
      .refine((data) => data >= 1 && data <= 5, {
        message: 'Rating must be between 1 and 5',
      }),
    review: z.string({ required_error: 'Review is required' }),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Review must be string',
    }),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};
