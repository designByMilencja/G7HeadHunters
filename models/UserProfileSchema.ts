import { Schema, model } from 'mongoose';

const UserProfileSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
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
      match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Invalid URL'],
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
