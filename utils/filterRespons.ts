import { AdminRespons, HrRespons, IAdmin, IHR, IUser, UserRespons } from '../types';

export const filterUser = (user: IUser): UserRespons => {
  const { _id, email, role, active, status } = user;
  return { _id, email, role, active, status };
};

export const filterHr = (hr: IHR): HrRespons => {
  const { _id, email, role, company, fullName, maxReservedStudents, users } = hr;
  return { _id, email, role, fullName, company, maxReservedStudents, users };
};

export const filterAdmin = (admin: IAdmin): AdminRespons => {
  const { _id, email, role } = admin;
  return { _id, email, role };
};
