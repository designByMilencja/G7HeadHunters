import { NextFunction, Request, Response } from 'express';
import { UserSkillDb } from '../models/UserSkillsSchema';
import { UserDb } from '../models/UserSchema';
import { UserProfileDb } from '../models/UserProfileSchema';
import { UserSkillsExpectations } from '../types';
import { userToHrResponse } from '../utils/filterRespons';
import { ValidationError } from '../utils/handleError';

export const availableUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const availableUsers = await UserDb.find({ status: 'Dostępny', active: true }).distinct('email').lean();

    const users = await UserSkillDb.find({ email: { $in: availableUsers } }).populate('profile');
    if (!users) throw new ValidationError('Users not found');

    const availableUsersProfile = users.map((user): UserSkillsExpectations => userToHrResponse(user));

    res.status(200).send(availableUsersProfile);
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.body || '';

  try {
    const searchData = await UserProfileDb.find({
      $or: [
        { email: { $regex: search } },
        { phone: { $regex: search } },
        { firstName: { $regex: search } },
        { lastName: { $regex: search } },
        { githubUsername: { $regex: search } },
        { bio: { $regex: search } },
        { expectedTypeWork: { $regex: search } },
        { targetWorkCity: { $regex: search } },
        { expectedContractType: { $regex: search } },
        { expectedSalary: { $regex: search } },
        { education: { $regex: search } },
        { workExperience: { $regex: search } },
        { courses: { $regex: search } },
      ],
    })
      .distinct('email')
      .lean();

    const searchResult = await Promise.all(
      searchData.map((email) => UserSkillDb.findOne({ email }).populate('profile'))
    );

    const searchUsers = searchResult.map((user): UserSkillsExpectations => userToHrResponse(user));

    res.status(200).send(searchUsers);
  } catch (err) {
    next(err);
  }
};

export const reservedUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    if (req.user._id.toString() !== id) {
      throw new ValidationError('Token not match to user');
    }
    const hr = await UserDb.findById(id);

    const reservedUsers = await Promise.all(
      hr.users.map((email) => UserSkillDb.findOne({ email }).populate('profile'))
    );

    const reservedUsersProfile = reservedUsers.map((user): UserSkillsExpectations => userToHrResponse(user));
    res.status(200).send(reservedUsersProfile);
  } catch (err) {
    next(err);
  }
};

export const setStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email, status } = req.body;
  try {
    if (req.user._id.toString() !== id) {
      throw new ValidationError('Token not match to user');
    }

    const user = await UserDb.findOne({ email });
    if (!user) throw new ValidationError('Users not found');

    user.status.status = status;
    user.save();

    const hr = await UserDb.findById(id);
    const isUserInArray = hr.users.includes(email);

    if (status === 'W trakcie rozmowy' && !isUserInArray) {
      hr.users.push(email);
      hr.save();
    }

    if (status !== 'W trakcie rozmowy' && isUserInArray) {
      hr.users = hr.users.filter((e) => e !== email);
      hr.save();
    }

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};
