import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

export enum Status {
  AVAILABLE = 'Dostępny',
  RESERVED = 'W trakcie rozmowy',
  EMPLOYED = 'Zatrudniony',
}

export enum Role {
  ADMIN = 'Admin',
  USER = 'Kursant',
  HR = 'HR',
}

export enum TypeWork {
  ONSITE = 'Na miejscu',
  READYTOMOVE = 'Gotowość do przeprowadzki',
  REMOTEWORK = 'Wyłącznie zdalnie',
  HYBRID = 'Hybrydowo',
  WHATEVER = 'Bez znaczenia',
}

export enum ContractType {
  UOP = 'Tylko UoP',
  B2B = 'Możliwe B2B',
  UOD = 'Możliwe UZ/UoD',
  NOPREFERENCE = 'Brak preferencji',
}

export enum Apprenticeship {
  YES = 'TAK',
  NO = 'NIE',
}

export interface DecodedToken extends JwtPayload {
  _id: string;
}

export interface User {
  _id?: Types.ObjectId;
  email: string;
  role: Role;
}

export enum HrTabs {
  AVAILABLE = '1',
  RESERVED = '2',
}
