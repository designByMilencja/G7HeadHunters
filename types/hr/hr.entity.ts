import { Types } from 'mongoose';
import { Role } from '../common';

export interface IHR {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  token?: string | null;
  role: Role;
  fullName: string;
  company: string;
  maxReservedStudents: number;
  users?: string[];
}

export type HrResponse = Omit<IHR, 'password' | 'token'>;
