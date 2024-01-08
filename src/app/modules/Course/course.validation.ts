import { z } from 'zod';

const tagsSchema = z.object({
  name: z.string({
    required_error: 'Tag Name is required',
    invalid_type_error: 'Tag Name must be a string',
  }),
  isDeleted: z
    .boolean({
      invalid_type_error: 'isDeleted must be a boolean',
    })
    .optional(),
});

const detailsSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
});

const upateTagsSchema = z.object({
  name: z
    .string({
      required_error: 'Tag Name is required',
      invalid_type_error: 'Tag Name must be a string',
    })
    .optional(),
  isDeleted: z
    .boolean({
      invalid_type_error: 'isDeleted must be a boolean',
    })
    .optional(),
});

const updateDetailsSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    }),
    instructor: z.string({
      required_error: 'Instructor is required',
      invalid_type_error: 'Instructor must be a string',
    }),
    categoryId: z.string({
      required_error: 'Category ID is required',
      invalid_type_error: 'Invalid category ID',
    }),
    price: z.number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    }),
    tags: z.array(tagsSchema),
    startDate: z.string({
      required_error: 'Start Date is required',
      invalid_type_error: 'Start Date must be a string',
    }),
    endDate: z.string({
      required_error: 'End Date is required',
      invalid_type_error: 'End Date must be a string',
    }),
    language: z.string({
      required_error: 'Language is required',
      invalid_type_error: 'Language must be a string',
    }),
    provider: z.string({
      required_error: 'Provider is required',
      invalid_type_error: 'Provider must be a string',
    }),
    details: detailsSchema,
  }),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
      })
      .optional(),
    instructor: z
      .string({
        required_error: 'Instructor is required',
        invalid_type_error: 'Instructor must be a string',
      })
      .optional(),
    categoryId: z
      .string({
        required_error: 'Category ID is required',
        invalid_type_error: 'Invalid category ID',
      })
      .optional(),
    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .optional(),
    tags: z.array(upateTagsSchema).optional(),
    startDate: z
      .string({
        required_error: 'Start Date is required',
        invalid_type_error: 'Start Date must be a string',
      })
      .optional(),
    endDate: z
      .string({
        required_error: 'End Date is required',
        invalid_type_error: 'End Date must be a string',
      })
      .optional(),
    language: z
      .string({
        required_error: 'Language is required',
        invalid_type_error: 'Language must be a string',
      })
      .optional(),
    provider: z
      .string({
        required_error: 'Provider is required',
        invalid_type_error: 'Provider must be a string',
      })
      .optional(),
    details: updateDetailsSchema.optional(),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
