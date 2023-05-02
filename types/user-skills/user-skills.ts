import { Types } from 'mongoose';

export interface IUserSkills {
  _id: Types.ObjectId;
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: Types.Array<string>;
  profile?: Types.ObjectId;
}
