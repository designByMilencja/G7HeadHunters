import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

export enum Status {
  available = 'Dostępny',
  reserved = 'W trakcie rozmowy',
  employed = 'Zatrudniony',
}

export enum Role {
  admin = 'Admin',
  user = 'Kursant',
  hr = 'HR',
}

export enum TypeWork {
  onSite = 'Na miejscu',
  readyToMove = 'Gotowość do przeprowadzki',
  remoteWork = 'Wyłącznie zdalnie',
  hybrid = 'Hybrydowo',
  whatever = 'Bez znaczenia',
}

export enum ContractType {
  uop = 'Tylko UoP',
  b2b = 'Możliwe B2B',
  uod = 'Możliwe UZ/UoD',
  noPreference = 'Brak preferencji',
}

export enum Apprenticeship {
  yes = 'TAK',
  no = 'NIE',
}

export interface DecodedToken extends JwtPayload {
  _id: string;
}

export interface User {
  _id?: Types.ObjectId;
  email: string;
  role: Role;
}
