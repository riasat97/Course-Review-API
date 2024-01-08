import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Category name must be string',
      required_error: 'Category name is required',
    }),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Category name must be string',
        required_error: 'Category name is required',
      })
      .optional(),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
