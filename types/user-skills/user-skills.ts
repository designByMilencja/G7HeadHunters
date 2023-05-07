import { PopulatedDoc, Types, Document } from 'mongoose';
import { IUserProfileEntity } from '../user-profile';

export interface IUserSkills {
  _id?: Types.ObjectId;
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: Types.Array<string>;
  profile?: PopulatedDoc<IUserProfileEntity & Document>;
}
