import { Schema, model } from 'mongoose';
import { IUserSkills } from "../types/user-skills";

const UserSkillsSchema = new Schema<IUserSkills>(
  {
    email: {
      type: String,
      required: true,
      max: 64,
      unique: true,
      match: [/^(.+)@(.+)$/, 'Invalid email'],
      index: true,
    },
    courseCompletion: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    courseEngagement: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    projectDegree: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    teamProjectDegree: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    bonusProjectUrls: {
      type: [String],
      required: true,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
    },
  },
  { timestamps: true, versionKey: false }
);

export const UserSkillDb = model('UserSkill', UserSkillsSchema);
