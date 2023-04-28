import { NextFunction, Request, Response } from 'express';
import { readFile, unlink } from 'fs/promises';
import { parse } from 'papaparse';
import path from 'path';
import { storageDir } from '../utils/handleFile';
import { UserSkillDb } from '../models/UserSkillsSchema';
import { ICsvSkillsErrors, IUserSkills } from '../types/user-skills';
import { validateHeader, validateRow, validateRowEmail, validateRowUrls } from '../utils/validateUserSkills';
import { ValidationError } from '../utils/handleError';

export const validateUserSkills = async (req: Request, res: Response, next: NextFunction) => {
  const csvFile = req.file;
  if (!csvFile) throw new ValidationError('No file found');

  try {
    const csv = await readFile(path.join(storageDir(), 'csv', csvFile.filename), 'utf8');
    const {
      meta: { fields },
      data,
    } = parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const headers = validateHeader(fields);
    const isHeaderError = headers.some(({ errors }) => errors?.error);

    if (isHeaderError) {
      return res.status(200).send({ errors: isHeaderError, headers, rows: [] });
    }

    const rows = await Promise.all(
      data.map(async (data: any) => {
        const errors: ICsvSkillsErrors = {};

        errors.email = await validateRowEmail(data.email);
        errors.courseCompletion = validateRow(data.courseCompletion);
        errors.courseEngagement = validateRow(data.courseEngagement);
        errors.teamProjectDegree = validateRow(data.teamProjectDegree);
        errors.projectDegree = validateRow(data.projectDegree);
        errors.bonusProjectUrls = validateRowUrls(data.bonusProjectUrls);

        return { row: data, errors };
      })
    );

    const isRowError = rows.some((row) => {
      const { errors } = row;
      return Object.values(errors).some((error) => Boolean(error));
    });

    res.status(200).send({ isRowError, headers, rows });
  } catch (err) {
    if (csvFile) {
      await unlink(path.join(storageDir(), 'csv', csvFile.filename));
    }
    next(err);
  }
};

export const saveUserSkills = async (req: Request, res: Response, next: NextFunction) => {
  const { fileName } = req.body;

  try {
    const csvFile = await readFile(path.join(storageDir(), 'csv', fileName), 'utf8');
    const { data } = parse(csvFile, {
      header: true,
      skipEmptyLines: true,
    });

    const addSkill = await Promise.all(
      data.map(async (data: IUserSkills) => {
        const skills = new UserSkillDb({
          email: data.email,
          projectDegree: data.projectDegree,
          courseCompletion: data.courseCompletion,
          courseEngagement: data.courseEngagement,
          teamProjectDegree: data.teamProjectDegree,
          bonusProjectUrls: data.bonusProjectUrls
            .toString()
            .split(',')
            .map((d) => d.trim()),
        });
        return skills.save();
      })
    );

    if (data.length === addSkill.length) {
      await unlink(path.join(storageDir(), 'csv', fileName));
    } else {
      res.send({ message: 'Something went wrong, try again' });
    }

    res.status(201).send(addSkill);
  } catch (err) {
    if (fileName) {
      await unlink(path.join(storageDir(), 'csv', fileName));
    }
    next(err);
  }
};
