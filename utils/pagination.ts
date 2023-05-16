import { PipelineStage } from 'mongoose';
import { IUserSkillsDocument, UserSkillDb } from '../models/UserSkillsSchema';
import { IUserProfileDocument } from '../models/UserProfileSchema';

type UserSkillsExpectations = IUserSkillsDocument & { profile: IUserProfileDocument };
type Result = [results: UserSkillsExpectations[], totalPage: { count: number }[]];

const limits = [10, 25, 50];
const defaultLimit = 10;

export const pipeline = (filter: any) => {
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

  const totalPages = Math.ceil(total[0].count / limit);

  return { results, totalPages };
};
