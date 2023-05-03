import { Types } from 'mongoose';

export interface IUserProfileEntity {
  _id?: Types.ObjectId;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  githubUsername: string;
  portfolioUrls: Types.Array<object>;
  projectUrls: Types.Array<string>;
  bio: string;
  expectedTypeWork: string;
  targetWorkCity: string;
  expectedContractType: string;
  expectedSalary: string;
  canTakeApprenticeship: string;
  monthsOfCommercialExp: number;
  education: string;
  workExperience: string;
  courses: string;
}
