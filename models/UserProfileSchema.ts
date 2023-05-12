import { Schema, model } from 'mongoose';
import { IUserProfileEntity } from '../types';
import { UserSkillDb } from './UserSkillsSchema';
import { ValidationError } from '../utils/handleError';

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
      unique: true,
    },
    githubAvatar: {
      type: String,
      default: '',
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
    reservationExpiryDate: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);

UserProfileSchema.post<IUserProfileEntity>('save', async (user, next) => {
  const userSkill = await UserSkillDb.findOne({ email: user.email });
  if (!userSkill) {
    throw new ValidationError(`Brak w bazie umiejętności użytkownika o emailu: ${user.email}`);
  }

  if (!userSkill.profile) {
    userSkill.profile = user._id;
    userSkill.save();
  }

  next();
});
export const UserProfileDb = model('UserProfile', UserProfileSchema);
