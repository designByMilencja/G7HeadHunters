import { Document, Query } from 'mongoose';
import { IUserSkillsDocument } from '../models/UserSkillsSchema';

const limits = [10, 25, 50];
const defaultLimit = 10;
export const pagination = async (
  query: Query<Document<IUserSkillsDocument>[], Document<IUserSkillsDocument>, {}, IUserSkillsDocument>,
  page: number,
  limit: number,
  match?: any
) => {
  limit = limits.includes(limit) ? limit : defaultLimit;

  const [results, total] = await Promise.all([
    query
      .populate({
        path: 'profile',
        match: match,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    query.model.countDocuments(query.getFilter()),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { results, totalPages };
};
