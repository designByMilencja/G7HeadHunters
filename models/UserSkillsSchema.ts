import { Schema, model } from 'mongoose';

const UserSkillsSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      match: [/^(.+)@(.+)$/, 'Invalid email'],
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
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const UserSkillsDb = model('UserSkills', UserSkillsSchema);
