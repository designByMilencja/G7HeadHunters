import { Schema, model } from 'mongoose';
import {IUserProfileEntity} from "../types";

const UserProfileSchema = new Schema<IUserProfileEntity>(
  {
    email: {
      type: String,
      required: true,
      max: 64,
      unique: true,
      match: [/^(.+)@(.+)$/, 'Invalid email'],
    },
    phone: {
      type: String,
      default: '',
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    githubUsername: {
      type: String,
      required: true,
    },
    portfolioUrls: [String],
    projectUrls: {
      type: [String],
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    expectedTypeWork: {
      type: String,
      enum: ['Na miejscu', 'Gotowość do przeprowadzki', 'Wyłącznie zdalnie', 'Hybrydowo', 'Bez znaczenia'],
      default: 'Bez znaczenia',
    },
    targetWorkCity: {
      type: String,
      default: '',
    },
    expectedContractType: {
      type: String,
      enum: ['Tylko UoP', 'Możliwe B2B', 'Możliwe UZ/UoD', 'Brak preferencji'],
      default: 'Brak preferencji',
    },
    expectedSalary: {
      type: String,
      default: '',
    },
    canTakeApprenticeship: {
      type: String,
      enum: ['TAK', 'NIE'],
      default: 'NIE',
    },
    monthsOfCommercialExp: {
      type: Number,
      min: 0,
      default: 0,
    },
    education: {
      type: String,
      default: '',
    },
    workExperience: {
      type: String,
      default: '',
    },
    courses: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, versionKey: false }
);
export const UserProfileDb = model('UserProfile', UserProfileSchema);
