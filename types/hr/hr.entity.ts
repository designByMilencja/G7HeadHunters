export interface IHR {
  email: string;
  password: string;
  token?: string | null;
  role: 'Admin' | 'Kursant' | 'HR';
  fullName: string;
  company: string;
  maxReservedStudents?: number;
  users?: string[];
}

export type HrRespons = Omit<IHR, 'password' | 'token'>;
