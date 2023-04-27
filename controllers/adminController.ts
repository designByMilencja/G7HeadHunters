import { NextFunction, Request, Response } from 'express';
import { readFile, unlink } from 'fs/promises';
import { parse } from 'papaparse';
import path from 'path';
import { storageDir } from '../utils/handleFile';
import { UserSkillDb } from '../models/UserSkillSchema';
import { ValidationError } from '../utils/handleError';

//TODO do zastąpienia po dodani typów
interface ISkills {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: [];
}
export const validateUserSkills = async (req: Request, res: Response, next: NextFunction) => {
  const csvFile = req.file;
  if (!csvFile) throw new ValidationError('No file found');

  try {
    const csv = await readFile(path.join(storageDir(), 'csv', csvFile.filename), 'utf8');
    const { data } = parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    //TODO validacja
    const error = false;

    if (error) {
      await unlink(path.join(storageDir(), 'csv', csvFile.filename));
    }
    res.status(200).send({ ok: true, fileName: csvFile.filename });
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
      data.map(async (data: ISkills) => {
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
