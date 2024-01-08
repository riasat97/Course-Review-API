/* eslint-disable @typescript-eslint/no-explicit-any */

export const transformUser = (user: any) => {
  const { _id, username, email, role } = user;

  return {
    _id,
    username,
    email,
    role,
  };
};
export const transformUserWithTimeStamp = (user: any) => {
  const { _id, username, email, role, createdAt, updatedAt } = user;

  return {
    _id,
    username,
    email,
    role,
    createdAt,
    updatedAt,
  };
};
