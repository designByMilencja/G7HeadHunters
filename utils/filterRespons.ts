import {
  AdminRespons,
  HrRespons,
  IAdmin,
  IHR,
  IUser,
  IUserProfileEntity,
  UserRespons,
  UserSkillsExpectations,
} from '../types';
import { Document, PopulatedDoc } from 'mongoose';

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

export const userToHrResponse = (user: PopulatedDoc<IUserProfileEntity & Document>): UserSkillsExpectations => {
  return {
    _id: user.profile._id,
    email: user.email,
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    avatar: user.profile.githubAvatar,
    courseCompletion: user.courseCompletion,
    courseEngagement: user.courseEngagement,
    projectDegree: user.projectDegree,
    teamProjectDegree: user.teamProjectDegree,
    expectedTypeWork: user.profile.expectedTypeWork,
    targetWorkCity: user.profile.targetWorkCity,
    expectedContractType: user.profile.expectedContractType,
    expectedSalary: user.profile.expectedSalary,
    canTakeApprenticeship: user.profile.canTakeApprenticeship,
    monthsOfCommercialExp: user.profile.monthsOfCommercialExp,
    reservationExpiryDate: user.profile.reservationExpiryDate
      ? user.profile.reservationExpiryDate.toISOString().slice(0, 10)
      : '',
  };
};
