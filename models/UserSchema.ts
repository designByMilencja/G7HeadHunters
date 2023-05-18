import { Document, Model, model, Schema } from 'mongoose';
import { ValidationError } from '../utils/handleError';
import { IAdmin, IHR, IStatus, IUser, Role, Status } from '../types';
import { UserProfileDb } from './UserProfileSchema';
import bcrypt from 'bcrypt';

interface IUserDocument extends Omit<IUser, '_id'>, Omit<IHR, '_id'>, Omit<IAdmin, '_id'>, Document {}
interface IUserModel extends Model<IUserDocument> {
  createNewUser(user: IUser, role: 'Admin' | 'Kursant' | 'HR'): Promise<IUserDocument>;
}

const StatusSchema = new Schema<IStatus>(
  {
    status: {
      type: String,
      enum: Status,
    },
  },
  { _id: false, timestamps: true, versionKey: false }
);

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      max: 64,
      unique: true,
      match: [/^(.+)@(.+)$/, 'Invalid email'],
      index: true,
    },
    password: {
      type: String,
      required: true,
      bcrypt: true,
    },
    token: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Role,
    },
    active: {
      type: Boolean,
    },
    status: {
      type: StatusSchema,
    },
    fullName: {
      type: String,
      required: function () {
        return this.role === 'HR';
      },
    },
    company: {
      type: String,
      required: function () {
        return this.role === 'HR';
      },
    },
    maxReservedStudents: {
      type: Number,
      min: 0,
      max: 999,
      required: function () {
        return this.role === 'HR';
      },
    },
    users: {
      type: [String],
      required: function () {
        return this.role === 'HR';
      },
    },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre('findOne', function (next) {
  if (this.getQuery().role === Role.user) {
    this.select('email password token role active status');
  }
  next();
});

UserSchema.pre('findOne', function (next) {
  if (this.getQuery().role === Role.hr) {
    this.select('email password token role fullName company maxReservedStudents users');
  }
  next();
});

UserSchema.statics.createNewUser = async function (user, role) {
  const existingUser = await this.findOne({ email: user.email });

  if (existingUser) {
    throw new ValidationError('Podany email istnieje już w bazie.');
  }

  switch (role) {
    case 'Kursant':
      const userData: IUser = {
        email: user.email,
        password: user.password,
        role: user.role,
        active: false,
        status: { status: Status.available },
      };
      const createdUser = await this.create(userData);
      return createdUser.save();

    case 'HR':
      const hrData: IHR = {
        email: user.email,
        password: user.password,
        token: user.token,
        role: user.role,
        fullName: user.fullName,
        company: user.company,
        maxReservedStudents: user.maxReservedStudents,
        users: [],
      };
      const createdHr = await this.create(hrData);
      return createdHr.save();

    case 'Admin':
      const adminData: IAdmin = {
        email: user.email,
        password: user.password,
        role: user.role,
      };
      const createdAdmin = await this.create(adminData);
      return createdAdmin.save();

    default:
      throw new ValidationError('Invalid user role');
  }
};

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('status') && this.status.status === 'W trakcie rozmowy') {
    const userProfile = await UserProfileDb.findOne({ email: this.email });

    if (userProfile) {
      const tenDays = 24 * 60 * 60 * 10000;
      userProfile.reservationExpiryDate = new Date(this.status.updatedAt.getTime() + tenDays);
      await userProfile.save();
    }
  }
  next();
});

export const UserDb = model<IUserDocument, IUserModel>('User', UserSchema);
