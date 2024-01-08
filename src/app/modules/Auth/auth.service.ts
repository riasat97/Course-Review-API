import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import { transformUser, transformUserWithTimeStamp } from '../user/user.utils';
import { TUser } from '../user/user.interface';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const { username } = payload;
  const userData = await User.findOne({ username }).select('+password');

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  if (!(await User.isPasswordMatched(payload?.password, userData?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //create token and sent to the  client

  const jwtPayload = {
    _id: userData._id,
    role: userData.role,
    email: userData.email,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const user = transformUser(userData);

  return {
    token,
    user,
  };
};

const changePassword = async (
  userPayload: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const { _id } = userPayload;
  const userData = await User.findById(_id).select('+password');

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  if (!(await User.isPasswordMatched(payload.oldPassword, userData?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  const passwordMatched = await User.isPasswordMatched(
    payload.newPassword,
    userData?.password,
  );
  // Check if the new password is different from the current one
  if (passwordMatched) {
    throw new Error(
      'New password must be different from the current password.',
    );
  }

  const passwordInHistory = await isPasswordInHistory(payload, userData);
  console.log(passwordInHistory);
  if (passwordInHistory) {
    const lastUsedTimestamp = userData.passwordChangeHistory?.[0]?.timestamp;
    const lastUsedOn =
      lastUsedTimestamp?.toLocaleString('en-BD', {
        timeZone: 'Asia/Dhaka', // Set the timezone to Bangladesh
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // for 12-hour format
      }) || 'unknown';

    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${lastUsedOn}).`,
    );
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  // Update password and history
  userData.password = newHashedPassword;
  userData?.passwordChangeHistory?.unshift({
    password: newHashedPassword,
    timestamp: new Date(),
  });

  // Keep only the last 2 changes
  userData.passwordChangeHistory = userData?.passwordChangeHistory?.slice(0, 2);

  // Save the updated user
  const updatedUser = await userData.save();
  const user = transformUserWithTimeStamp(updatedUser);
  return user;
};

const isPasswordInHistory = async (
  payload: { oldPassword: string; newPassword: string },
  userData: TUser,
) => {
  if (!userData?.passwordChangeHistory) {
    return false;
  }

  for (const change of userData.passwordChangeHistory) {
    const isMatched = await User.isPasswordMatched(
      payload.newPassword,
      change?.password,
    );
    if (isMatched) {
      return true;
    }
  }

  return false;
};

export const AuthServices = {
  loginUser,
  changePassword,
};
