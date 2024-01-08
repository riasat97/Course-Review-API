import { z } from 'zod';
import { USER_ROLE } from './user.constant';

const userValidationSchema = z.object({
  body: z.object({
    username: z.string(),
    email: z.string().email(),
    password: z
      .string({
        invalid_type_error: 'Password must be string',
      })
      .max(20, { message: 'Password can not be more than 20 characters' }),
    role: z.enum([...Object.keys(USER_ROLE)] as [string, ...string[]]),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
