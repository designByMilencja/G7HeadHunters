import {
  AdminResponse,
  HrResponse,
  IAdmin,
  IHR,
  InfoResponse,
  IUser,
  IUserProfileEntity,
  ProfileResponse,
  UserResponse,
  UserSkillsExpectations,
} from '../types';
import { Document, PopulatedDoc } from 'mongoose';

export const filterUser = (user: IUser): UserResponse => {
  const { _id, email, role, active, status } = user;
  return { _id, email, role, active, status };
};

export const filterHr = (hr: IHR): HrResponse => {
  const { _id, email, role, company, fullName, maxReservedStudents, users } = hr;
  return { _id, email, role, fullName, company, maxReservedStudents, users };
};

export const filterAdmin = (admin: IAdmin): AdminResponse => {
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

export const userInfo = (userProfile: PopulatedDoc<IUserProfileEntity & Document>, user: IUser): InfoResponse => {
  return {
    email: user.email,
    status: user.status.status,
    avatar: userProfile.profile.githubAvatar,
    firstName: userProfile.profile.firstName,
    lastName: userProfile.profile.lastName,
    githubUsername: userProfile.profile.githubUsername,
    phone: userProfile.profile.phone,
    bio: userProfile.profile.bio,
  };
};

export const userProfile = (userProfile: PopulatedDoc<IUserProfileEntity & Document>): ProfileResponse => {
  return {
    skills: {
      courseCompletion: userProfile.courseCompletion,
      courseEngagement: userProfile.courseEngagement,
      projectDegree: userProfile.projectDegree,
      teamProjectDegree: userProfile.teamProjectDegree,
    },
    expectations: {
      expectedTypeWork: userProfile.profile.expectedTypeWork,
      targetWorkCity: userProfile.profile.targetWorkCity,
      expectedContractType: userProfile.profile.expectedContractType,
      expectedSalary: userProfile.profile.expectedSalary,
      canTakeApprenticeship: userProfile.profile.canTakeApprenticeship,
      monthsOfCommercialExp: userProfile.profile.monthsOfCommercialExp,
    },
    education: userProfile.profile.education,
    courses: userProfile.profile.courses,
    workExperience: userProfile.profile.workExperience,
    portfolioUrls: userProfile.profile.portfolioUrls,
    bonusProjectUrls: userProfile.bonusProjectUrls,
    projectUrls: userProfile.profile.projectUrls,
  };
};
