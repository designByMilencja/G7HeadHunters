import { NextFunction, Request, Response } from 'express';
import { UserSkillDb } from '../models/UserSkillsSchema';
import { UserDb } from '../models/UserSchema';
import { UserProfileDb } from '../models/UserProfileSchema';
import { UserSkillsExpectations } from '../types';
import { filterHr, userToHrResponse } from '../utils/filterRespons';
import { pagination } from '../utils/pagination';
import { ValidationError } from '../utils/handleError';

export const availableUsers = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const availableUsers = await UserDb.find({ 'status.status': 'Dostępny', active: true }).distinct('email').lean();

    const { results, totalPages } = await pagination(UserSkillDb.find({ email: { $in: availableUsers } }), page, limit);

    const availableUsersProfile = results
      .map((user): UserSkillsExpectations => {
        if (user.profile && user.profile._id !== null) {
          return userToHrResponse(user);
        }
      })
      .filter((user) => user);

    res.status(200).send({ users: availableUsersProfile, page, totalPages });
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.body || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const searchUsers = await UserProfileDb.find({
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

    const { results, totalPages } = await pagination(UserSkillDb.find({ email: { $in: searchUsers } }), page, limit);

    const searchUsersProfile = results
      .map((user): UserSkillsExpectations => {
        if (user.profile && user.profile._id !== null) {
          return userToHrResponse(user);
        }
      })
      .filter((user) => user);

    res.status(200).send({ users: searchUsersProfile, page, totalPages });
  } catch (err) {
    next(err);
  }
};

export const reservedUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    if (req.user._id.toString() !== id) {
      throw new ValidationError('Token not match to user');
    }

    const hr = await UserDb.findById(id);

    const { results, totalPages } = await pagination(UserSkillDb.find({ email: { $in: hr.users } }), page, limit);

    const reservedUsersProfile = results
      .map((user): UserSkillsExpectations => {
        if (user.profile && user.profile._id !== null) {
          return userToHrResponse(user);
        }
      })
      .filter((user) => user);

    res.status(200).send({ users: reservedUsersProfile, page, totalPages });
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
    if (!hr) throw new ValidationError('Hr not found');

    const user = await UserDb.findOne({ email });
    if (!user) throw new ValidationError('Users not found');

    const isUserInArray = hr.users.includes(email);
    if (user.status.status === 'W trakcie rozmowy' && !isUserInArray) {
      throw new ValidationError(`Kursant jest już umówiony na rozmowę z inną firmą`);
    }

    if (user.status.status === status) throw new ValidationError(`Kursant jest już ${status}`);
    user.status.status = status;
    user.save();

    if (status === 'W trakcie rozmowy' && !isUserInArray) {
      const notMaxReservedStudents = hr.maxReservedStudents > hr.users.length;
      if (!notMaxReservedStudents) throw new ValidationError('Masz już maksymalną liczbę zarezerwowanych studentów.');

      hr.users.push(email);
      hr.save();
    }

    if (status !== 'W trakcie rozmowy' && isUserInArray) {
      hr.users = hr.users.filter((e) => e !== email);
      hr.save();
    }

    res.status(200).send(filterHr(hr));
  } catch (err) {
    next(err);
  }
};

export const filterUsers = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const {
    courseCompletion,
    courseEngagement,
    projectDegree,
    teamProjectDegree,
    expectedTypeWork,
    expectedSalary,
    canTakeApprenticeship,
    monthsOfCommercialExp,
  } = req.body;

  try {
    const filter = {
      courseCompletion: { $gte: courseCompletion ?? 0 },
      courseEngagement: { $gte: courseEngagement ?? 0 },
      projectDegree: { $gte: projectDegree ?? 0 },
      teamProjectDegree: { $gte: teamProjectDegree ?? 0 },
      profile: { $exists: true },
    };

    const match = {
      expectedTypeWork: expectedTypeWork ?? {
        $in: ['Na miejscu', 'Gotowość do przeprowadzki', 'Wyłącznie zdalnie', 'Hybrydowo', 'Bez znaczenia'],
      },
      expectedSalary: { $gte: expectedSalary ?? '' },
      canTakeApprenticeship: canTakeApprenticeship ?? {
        $in: ['TAK', 'NIE'],
      },
      monthsOfCommercialExp: { $gte: monthsOfCommercialExp ?? 0 },
    };

    const { results, totalPages } = await pagination(UserSkillDb.find(filter), page, limit, match);

    const filtered = results
      .map((user): UserSkillsExpectations => {
        if (user.profile && user.profile._id !== null) {
          return userToHrResponse(user);
        }
      })
      .filter((user) => user);

    res.status(200).send({ users: filtered, page, totalPages });
  } catch (err) {
    next(err);
  }
};
