import { NextFunction, Request, Response } from 'express';
import { UserSkillDb } from '../models/UserSkillsSchema';
import { UserDb } from '../models/UserSchema';
import { UserSkillsExpectations } from '../types';
import { filterHr, userToHrResponse } from '../utils/filterRespons';
import { pagination } from '../utils/pagination';
import { ValidationError } from '../utils/handleError';

export const availableUsers = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const availableUsers = await UserDb.find({ 'status.status': 'Dostępny', active: true }).distinct('email').lean();
    if (availableUsers.length === 0) throw new ValidationError('Brak dostępnych kursantów.');

    const { results, totalPages } = await pagination(UserSkillDb.find({ email: { $in: availableUsers } }), page, limit);

    const availableUsersProfile = results
      .map((user): UserSkillsExpectations => {
        if (user.profile && user.profile._id !== null) {
          return userToHrResponse(user);
        }
      })
      .filter((user) => user);

    res.status(200).send({ users: availableUsersProfile, totalPages });
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.body || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const filter = {
      $or: [
        { email: { $regex: `^.*${search}.*$`, $options: 'i' } },
        { firstName: { $regex: `^.*${search}.*$`, $options: 'i' } },
        { lastName: { $regex: `^.*${search}.*$`, $options: 'i' } },
      ],
      profile: { $exists: true },
    };

    const { results, totalPages } = await pagination(UserSkillDb.find(filter), page, limit);

    const searchUsersProfile = results
      .map((user): UserSkillsExpectations => {
        if (user.profile && user.profile._id !== null) {
          return userToHrResponse(user);
        }
      })
      .filter((user) => user);

    res.status(200).send({ users: searchUsersProfile, totalPages });
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
      throw new ValidationError('Nie masz dostępu do tego zasobu.');
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

    res.status(200).send({ users: reservedUsersProfile, totalPages });
  } catch (err) {
    next(err);
  }
};

export const setStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email, status } = req.body;

  try {
    if (req.user._id.toString() !== id) {
      throw new ValidationError('Nie masz dostępu do tego zasobu.');
    }

    const hr = await UserDb.findById(id);
    if (!hr) throw new ValidationError(`Brak użytkownika z id: ${id}.`);

    const user = await UserDb.findOne({ email });
    if (!user) throw new ValidationError(`Brak kursanta z adresem email: ${email}.`);

    const isUserInArray = hr.users.includes(email);
    if (user.status.status === 'W trakcie rozmowy' && !isUserInArray) {
      throw new ValidationError(`Kursant jest już umówiony na rozmowę z inną firmą`);
    }

    if (user.status.status === status) throw new ValidationError(`Kursant jest już ${status}`);
    user.status.status = status;
    user.save();

    if (status === 'W trakcie rozmowy' && !isUserInArray) {
      const notMaxReservedStudents = hr.maxReservedStudents > hr.users.length;
      if (!notMaxReservedStudents) throw new ValidationError('Masz już maksymalną liczbę zarezerwowanych kursantów.');

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

  if (!req.body || Object.keys(req.body).length === 0) throw new ValidationError('Brak wybranych filtrów');

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

    res.status(200).send({ users: filtered, totalPages });
  } catch (err) {
    next(err);
  }
};
