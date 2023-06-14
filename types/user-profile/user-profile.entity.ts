import { Types } from 'mongoose';
import { Apprenticeship, ContractType, Status, TypeWork } from '../common';

export interface IUserProfileEntity {
  _id?: Types.ObjectId;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  githubUsername: string;
  githubAvatar?: string;
  portfolioUrls?: Array<string>;
  projectUrls: Array<string>;
  bio?: string;
  expectedTypeWork: TypeWork;
  targetWorkCity?: string;
  expectedContractType: ContractType;
  expectedSalary?: number;
  canTakeApprenticeship: Apprenticeship;
  monthsOfCommercialExp: number;
  education?: string;
  workExperience?: string;
  courses?: string;
  reservationExpiryDate?: Date;
}

export interface Skills {
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
}

export interface Expectations {
  expectedTypeWork: TypeWork;
  targetWorkCity: string;
  expectedContractType: ContractType;
  expectedSalary: string;
  canTakeApprenticeship: Apprenticeship;
  monthsOfCommercialExp: number;
}

export interface UserSkillsExpectations extends Skills, Expectations {
  _id?: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  reservationExpiryDate?: Date;
}

export interface InfoResponse {
  avatar: string;
  firstName: string;
  lastName: string;
  githubUsername: string;
  email: string;
  phone?: string;
  bio?: string;
  status: Status;
}

export interface ProfileResponse {
  skills: Skills;
  expectations: Expectations;
  education?: string;
  courses?: string;
  workExperience?: string;
  portfolioUrls?: Array<string>;
  bonusProjectUrls: Array<string>;
  projectUrls: Array<string>;
}

export interface UserProfilResponse {
  info: InfoResponse;
  profile: ProfileResponse;
}
