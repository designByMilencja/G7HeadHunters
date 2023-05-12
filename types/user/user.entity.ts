import { Types } from 'mongoose';

export interface IStatus {
  status: 'Dostępny' | 'W trakcie rozmowy' | 'Zatrudniony';
  updatedAt?: Date;
}

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  token?: string | null;
  role: 'Admin' | 'Kursant' | 'HR';
  active?: boolean;
  status?: IStatus;
}

export type UserRespons = Omit<IUser, 'password' | 'token'>;
