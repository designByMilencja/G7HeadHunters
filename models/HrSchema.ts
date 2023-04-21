import { Schema, model } from 'mongoose';
import {HrEntity} from "../types";

const HrSchema = new Schema<HrEntity>(
  {
    email: {
      type: String,
      required: true,
      max: 64,
      unique: true,
      match: [/^(.+)@(.+)$/, 'Invalid email'],
    },
    fullName: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    maxReservedStudents: {
      type: Number,
      min: 0,
      max: 999,
      default: 0,
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
    role: {
      type: String,
      enum: ['Admin', 'Kursant', 'HR'],
      default: '',
    },
    users: [String],
  },
  { timestamps: true, versionKey: false }
);

export const HrDb = model('Hr', HrSchema);
