import { Types } from 'mongoose';
import { Role } from '../common';

export interface IAdmin {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  token?: string | null;
  role: Role;
}

export type AdminResponse = Omit<IAdmin, 'password' | 'token'>;
