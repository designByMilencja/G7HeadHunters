import { NextFunction, Request, Response } from 'express';
import { UserDb } from '../models/UserSchema';
import { UserSkillsExpectations } from '../types';
import { filterHr, userToHrResponse } from '../utils/filterRespons';
import { pagination, pipeline } from '../utils/pagination';
import { ValidationError } from '../utils/handleError';

export const availableUsers = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const availableUsers = await UserDb.find({ 'status.status': 'Dostępny', active: true })
      .distinct('email')
      .lean()
      .exec();

    if (availableUsers.length === 0) throw new ValidationError('Brak dostępnych kursantów.');

    const { results, totalCount, totalPages } = await pagination(
      pipeline({ email: { $in: availableUsers } }),
      page,
      limit
    );

    const availableUsersProfile = results
      .map((user): UserSkillsExpectations => {
        if (user.profile && user.profile._id !== null) {
          return userToHrResponse(user);
        }
        return null;
      })
      .filter((user) => user);

    res.status(200).send({ users: availableUsersProfile, totalCount, totalPages });
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { search = '' } = req.body;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const filter = {
      $or: [
        { email: { $regex: `^.*${search}.*$`, $options: 'i' } },
        { 'profile.firstName': { $regex: `^.*${search}.*$`, $options: 'i' } },
        { 'profile.lastName': { $regex: `^.*${search}.*$`, $options: 'i' } },
      ],
    };

    const availableUsers = await UserDb.find({ 'status.status': 'Dostępny', active: true })
      .distinct('email')
      .lean()
      .exec();

    if (availableUsers.length === 0) throw new ValidationError('Brak dostępnych kursantów.');

    const { results, totalCount, totalPages } = await pagination(
      pipeline({ ...filter, email: { $in: availableUsers } }),
      page,
      limit
    );

    const searchUsersProfile = results
      .map((user): UserSkillsExpectations => {
        if (user.profile && user.profile._id !== null) {
          return userToHrResponse(user);
        }
        return null;
      })
      .filter((user) => user);

    res.status(200).send({ users: searchUsersProfile, totalCount, totalPages });
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

    const hr = await UserDb.findById(id).exec();

    const { results, totalCount, totalPages } = await pagination(pipeline({ email: { $in: hr.users } }), page, limit);

    const reservedUsersProfile = results
      .map((user): UserSkillsExpectations => {
        if (user.profile && user.profile._id !== null) {
          return userToHrResponse(user);
        }
        return null;
      })
      .filter((user) => user);

    res.status(200).send({ users: reservedUsersProfile, totalCount, totalPages });
  } catch (err) {
    next(err);
  }
};
// @TODO wyslij maila adminowi ze kursant został zatrudniony
export const setStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email, status } = req.body;

  try {
    if (req.user._id.toString() !== id) {
      throw new ValidationError('Nie masz dostępu do tego zasobu.');
    }

    const hr = await UserDb.findById(id).exec();
    if (!hr) throw new ValidationError(`Brak użytkownika z id: ${id}.`);

    const user = await UserDb.findOne({ email }).exec();
    if (!user) throw new ValidationError(`Brak kursanta z adresem email: ${email}.`);

    const isUserInArray = hr.users.includes(email);
    if (user.status.status === 'W trakcie rozmowy' && !isUserInArray) {
      throw new ValidationError(`Kursant jest już umówiony na rozmowę z inną firmą`);
    }

    if (user.status.status === status) throw new ValidationError(`Kursant jest już ${status}`);

    if (status === 'W trakcie rozmowy' && !isUserInArray) {
      const notMaxReservedStudents = hr.maxReservedStudents > hr.users.length;
      if (!notMaxReservedStudents) throw new ValidationError('Masz już maksymalną liczbę zarezerwowanych kursantów.');

      hr.users.push(email);
      await hr.save();
    }

    if (status !== 'W trakcie rozmowy' && isUserInArray) {
      hr.users = hr.users.filter((e) => e !== email);
      await hr.save();
    }

    user.status.status = status;
    await user.save();

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
    monthsOfCommercialExp,
    expectedSalaryFrom,
    expectedSalaryTo,
    expectedTypeWork,
    expectedContractType,
    canTakeApprenticeship,
  } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) throw new ValidationError('Brak wybranych filtrów');

  const filter = {
    ...(courseCompletion && { courseCompletion: { $gte: parseInt(courseCompletion) } }),
    ...(courseEngagement && { courseEngagement: { $gte: parseInt(courseEngagement) } }),
    ...(projectDegree && { projectDegree: { $gte: parseInt(projectDegree) } }),
    ...(teamProjectDegree && { teamProjectDegree: { $gte: parseInt(teamProjectDegree) } }),
    ...(monthsOfCommercialExp && { 'profile.monthsOfCommercialExp': { $gte: parseInt(monthsOfCommercialExp) } }),
    ...(expectedTypeWork && { 'profile.expectedTypeWork': { $eq: expectedTypeWork } }),
    ...(expectedContractType && { 'profile.expectedContractType': { $eq: expectedContractType } }),
    ...(canTakeApprenticeship && { 'profile.canTakeApprenticeship': { $eq: canTakeApprenticeship } }),
    ...(expectedSalaryFrom &&
      expectedSalaryTo && {
        'profile.expectedSalary': {
          $gte: parseInt(expectedSalaryFrom),
          $lte: parseInt(expectedSalaryTo),
        },
      }),
  };

  try {
    const availableUsers = await UserDb.find({ 'status.status': 'Dostępny', active: true })
      .distinct('email')
      .lean()
      .exec();

    if (availableUsers.length === 0) throw new ValidationError('Brak dostępnych kursantów.');

    const { results, totalCount, totalPages } = await pagination(
      pipeline({ ...filter, email: { $in: availableUsers } }),
      page,
      limit
    );

    const reservedUsersProfile = results
      .map((user): UserSkillsExpectations => {
        if (user.profile && user.profile._id !== null) {
          return userToHrResponse(user);
        }
        return null;
      })
      .filter((user) => user);

    res.status(200).send({ users: reservedUsersProfile, totalCount, totalPages });
  } catch (err) {
    next(err);
  }
};
