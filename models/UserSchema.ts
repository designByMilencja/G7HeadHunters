import { Schema, model } from 'mongoose';
import {UserEntity} from "../types/users";

const UserSchema = new Schema<UserEntity>(
  {
    email: {
      type: String,
      required: true,
      max: 50,
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
  },
  { timestamps: true, versionKey: false }
);

export const UserDb = model('User', UserSchema);
