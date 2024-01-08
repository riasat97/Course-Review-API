import config from '../../config';
import { TUser } from './user.interface';
import { User } from './user.model';
import bcrypt from 'bcrypt';

const registerIntoDB = async (payload: TUser) => {
  const { password, ...remainingData } = payload;
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const newUser = await User.create({
    password: hashedPassword,
    ...remainingData,
  });
  return newUser;
};

export const UserServices = {
  registerIntoDB,
};
