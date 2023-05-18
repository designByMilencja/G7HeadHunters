import { Types } from 'mongoose';
import { Role, Status } from '../common';

export interface IStatus {
  status: Status;
  updatedAt?: Date;
}

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  token?: string | null;
  role: Role;
  active?: boolean;
  status?: IStatus;
}

export type UserResponse = Omit<IUser, 'password' | 'token'>;
