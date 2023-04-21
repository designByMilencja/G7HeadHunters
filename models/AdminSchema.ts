import { Schema, model } from 'mongoose';

const AdminSchema = new Schema(
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
    role: {
      type: String,
      enum: ['Admin', 'Kursant', 'HR'],
      default: '',
    },
  },
  { timestamps: true, versionKey: false }
);

export const AdminDb = model('Admin', AdminSchema);
