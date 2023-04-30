import { IUser, UserRespons } from '../types';

export const filterUser = (user: IUser): UserRespons => {
  const { email, role, active, token, status, password } = user;
  return { email, role, active, status };
};
