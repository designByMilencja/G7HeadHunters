import { Schema, model } from 'mongoose';
import {UserEntity} from "../types";

const UserSchema = new Schema<UserEntity>(
  {
    email: {
      type: String,
      required: true,
      max: 64,
      unique: true,
      match: [/^(.+)@(.+)$/, 'Invalid email'],
    },
    password: {
      type: String,
      required: true,
      bcrypt: true,
    },
    token: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Dostępny', 'W trakcie rozmowy', 'Zatrudniony'],
      default: 'Dostępny',
    },
    role: {
      type: String,
      enum: ['Admin', 'Kursant', 'HR'],
      default: '',
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
  },
  { timestamps: true, versionKey: false }
);

export const UserDb = model('User', UserSchema);
