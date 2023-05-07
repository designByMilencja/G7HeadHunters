import { Types } from 'mongoose';

interface Urls {
  url: string;
}

export interface IUserProfileEntity {
  _id?: Types.ObjectId;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  githubUsername: string;
  githubAvatar?: string;
  portfolioUrls?: Types.Array<string>;
  projectUrls: Types.Array<Urls>;
  bio?: string;
  expectedTypeWork: 'Na miejscu' | 'Gotowość do przeprowadzki' | 'Wyłącznie zdalnie' | 'Hybrydowo' | 'Bez znaczenia';
  targetWorkCity?: string;
  expectedContractType: 'Tylko UoP' | 'Możliwe B2B' | 'Możliwe UZ/UoD' | 'Brak preferencji';
  expectedSalary?: string;
  canTakeApprenticeship: 'TAK' | 'NIE';
  monthsOfCommercialExp: number;
  education?: string;
  workExperience?: string;
  courses?: string;
}

interface Skills {
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
}

interface Expectations {
  expectedTypeWork: 'Na miejscu' | 'Gotowość do przeprowadzki' | 'Wyłącznie zdalnie' | 'Hybrydowo' | 'Bez znaczenia';
  targetWorkCity?: string;
  expectedContractType: 'Tylko UoP' | 'Możliwe B2B' | 'Możliwe UZ/UoD' | 'Brak preferencji';
  expectedSalary?: string;
  canTakeApprenticeship: 'TAK' | 'NIE';
  monthsOfCommercialExp: number;
}

export interface InfoResponse {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  status: 'Dostępny' | 'W trakcie rozmowy' | 'Zatrudniony';
}

export interface ProfileResponse {
  skills: Skills;
  expectations: Expectations;
  education?: string;
  courses?: string;
  workExperience?: string;
  portfolioUrls?: Types.Array<string>;
  bonusProjectUrls: Types.Array<string>;
  projectUrls: Types.Array<string>;
}

export interface UserProfilResponse {
  info: InfoResponse;
  profile: ProfileResponse;
}
