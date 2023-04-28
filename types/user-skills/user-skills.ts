import { Types } from 'mongoose';

export interface IUserSkills {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: Types.Array<string>;
  profile?: Types.ObjectId;
}
