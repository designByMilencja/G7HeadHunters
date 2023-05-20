import { Schema, model, Document } from 'mongoose';
import { Apprenticeship, ContractType, IUserProfileEntity, TypeWork } from '../types';
import { UserSkillDb } from './UserSkillsSchema';
import { ValidationError } from '../utils/handleError';

export interface IUserProfileDocument extends Omit<IUserProfileEntity, '_id'>, Document {}

const UserProfileSchema = new Schema<IUserProfileDocument>(
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
      enum: TypeWork,
      default: TypeWork.whatever,
    },
    targetWorkCity: {
      type: String,
      default: '',
    },
    expectedContractType: {
      type: String,
      enum: ContractType,
      default: ContractType.noPreference,
    },
    expectedSalary: {
      type: Number,
      default: 0,
    },
    canTakeApprenticeship: {
      type: String,
      enum: Apprenticeship,
      default: Apprenticeship.no,
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
export const UserProfileDb = model<IUserProfileDocument>('UserProfile', UserProfileSchema);
