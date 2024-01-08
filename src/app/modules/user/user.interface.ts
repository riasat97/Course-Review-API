/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

interface PasswordChange {
  password: string;
  timestamp: Date;
}

export interface TUser {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  passwordChangeHistory?: PasswordChange[];
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByUsername(usrname: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
