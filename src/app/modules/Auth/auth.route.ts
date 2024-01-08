import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './../user/user.constant';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { UserControllers } from '../user/user.controller';
import { UserValidation } from '../user/user.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidation.userValidationSchema),
  UserControllers.register,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
