import { Types } from 'mongoose';

export interface IUserProfileEntity {
  _id?: Types.ObjectId;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  githubUsername: string;
  githubAvatar?: string;
  portfolioUrls?: Array<string>;
  projectUrls: Array<string>;
  bio?: string;
  expectedTypeWork: 'Na miejscu' | 'Gotowość do przeprowadzki' | 'Wyłącznie zdalnie' | 'Hybrydowo' | 'Bez znaczenia';
  targetWorkCity?: string;
  expectedContractType: 'Tylko UoP' | 'Możliwe B2B' | 'Możliwe UZ/UoD' | 'Brak preferencji';
  expectedSalary?: number;
  canTakeApprenticeship: 'TAK' | 'NIE';
  monthsOfCommercialExp: number;
  education?: string;
  workExperience?: string;
  courses?: string;
  reservationExpiryDate?: Date;
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

export interface UserSkillsExpectations extends Skills, Expectations {
  _id?: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  reservationExpiryDate?: Date;
}

export interface InfoResponse {
  avatar: string;
  firstName: string;
  lastName: string;
  githubUsername: string;
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
  portfolioUrls?: Array<string>;
  bonusProjectUrls: Array<string>;
  projectUrls: Array<string>;
}

export interface UserProfilResponse {
  info: InfoResponse;
  profile: ProfileResponse;
}
