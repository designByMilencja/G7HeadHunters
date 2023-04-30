import { HrRespons, IHR, IUser, UserRespons } from '../types';

export const filterUser = (user: IUser): UserRespons => {
  const { email, role, active, status } = user;
  return { email, role, active, status };
};

export const filterHr = (hr: IHR): HrRespons => {
  const { email, role, company, fullName, maxReservedStudents, users } = hr;
  return { email, role, fullName, company, maxReservedStudents, users };
};
