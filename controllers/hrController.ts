import { NextFunction, Request, Response } from 'express';
import { UserSkillDb } from '../models/UserSkillsSchema';
import { UserDb } from '../models/UserSchema';
import { UserSkillsExpectations } from '../types';
import { ValidationError } from '../utils/handleError';

export const availableUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const availableUsers = await UserDb.find({ status: 'Dostępny', active: true }).distinct('email');

    const users = await UserSkillDb.find({ email: { $in: availableUsers } }).populate('profile');
    if (!users) throw new ValidationError('Users not found');

    const availableUsersProfile = users.map((user): UserSkillsExpectations => {
      return {
        _id: user.profile._id,
        email: user.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        avatar: user.profile.githubAvatar,
        courseCompletion: user.courseCompletion,
        courseEngagement: user.courseEngagement,
        projectDegree: user.projectDegree,
        teamProjectDegree: user.teamProjectDegree,
        expectedTypeWork: user.profile.expectedTypeWork,
        targetWorkCity: user.profile.targetWorkCity,
        expectedContractType: user.profile.expectedContractType,
        expectedSalary: user.profile.expectedSalary,
        canTakeApprenticeship: user.profile.canTakeApprenticeship,
        monthsOfCommercialExp: user.profile.monthsOfCommercialExp,
      };
    });

    res.status(200).send(availableUsersProfile);
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.body;
  try {
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

    const reservedUsersProfile = reservedUsers.map((user): UserSkillsExpectations => {
      return {
        _id: user.profile._id,
        email: user.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        avatar: user.profile.githubAvatar,
        courseCompletion: user.courseCompletion,
        courseEngagement: user.courseEngagement,
        projectDegree: user.projectDegree,
        teamProjectDegree: user.teamProjectDegree,
        expectedTypeWork: user.profile.expectedTypeWork,
        targetWorkCity: user.profile.targetWorkCity,
        expectedContractType: user.profile.expectedContractType,
        expectedSalary: user.profile.expectedSalary,
        canTakeApprenticeship: user.profile.canTakeApprenticeship,
        monthsOfCommercialExp: user.profile.monthsOfCommercialExp,
      };
    });
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

    const hr = await UserDb.findById(id);
    hr.users.push(email);
    hr.save();

    const user = await UserDb.findOne({ email });
    if (!user) throw new ValidationError('Users not found');

    user.status = status;
    user.save();

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};
