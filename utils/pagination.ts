import { PipelineStage, FilterQuery } from 'mongoose';
import { IUserSkillsDocument, UserSkillDb } from '../models/UserSkillsSchema';
import { IUserProfileDocument } from '../models/UserProfileSchema';
import { UserDb } from '../models/UserSchema';
import { ValidationError } from './handleError';

type UserSkillsExpectations = IUserSkillsDocument & { profile: IUserProfileDocument };
type Result = [results: UserSkillsExpectations[], totalPage: { count: number }[]];

const limits = [10, 25, 50];
const defaultLimit = 10;

export const getAvailableUsers = async () => {
  const users = await UserDb.find({ 'status.status': 'Dostępny', active: true }).distinct('email').lean().exec();

  if (users.length === 0) throw new ValidationError('Brak dostępnych kursantów.');

  return users;
};

export const getReservedUsers = async (id: string) => {
  const users = await UserDb.findById(id).distinct('users').lean().exec();

  if (users.length === 0) throw new ValidationError('Brak dostępnych kursantów.');

  return users;
};

export const pipeline = (filter: FilterQuery<object>) => {
  return [
    {
      $lookup: {
        from: 'userprofiles',
        localField: 'profile',
        foreignField: '_id',
        as: 'profile',
      },
    },
    {
      $unwind: '$profile',
    },
    {
      $match: filter,
    },
  ];
};

export const pagination = async (pipeline: PipelineStage[], page: number, limit: number) => {
  limit = limits.includes(limit) ? limit : defaultLimit;

  const [results, total] = (await Promise.all([
    UserSkillDb.aggregate(pipeline)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec(),
    UserSkillDb.aggregate([...pipeline, { $count: 'count' }]).exec(),
  ])) as Result;

  const totalCount = results.length > 0 ? total[0].count : 0;

  const totalPages = Math.ceil(totalCount / limit);

  return { results, totalCount, totalPages };
};
