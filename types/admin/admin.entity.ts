import { Types } from 'mongoose';

export interface IAdmin {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  token?: string | null;
  role: 'Admin' | 'Kursant' | 'HR';
}

export type AdminRespons = Omit<IAdmin, 'password' | 'token'>;
