import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  token?: string | null;
  role: 'Admin' | 'Kursant' | 'HR';
  active?: boolean;
  status?: 'Dostępny' | 'W trakcie rozmowy' | 'Zatrudniony';
}
