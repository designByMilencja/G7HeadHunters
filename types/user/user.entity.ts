export interface IUser {
  email: string;
  password: string;
  token?: string | null;
  role: 'Admin' | 'Kursant' | 'HR';
  active?: boolean;
  status?: 'Dostępny' | 'W trakcie rozmowy' | 'Zatrudniony';
}

export type UserRespons = Omit<IUser, 'password' | 'token'>;
