import { NextFunction, Request, Response } from 'express';
import { readFile, unlink } from 'fs/promises';
import { parse } from 'papaparse';
import path from 'path';
import { storageDir } from '../utils/handleFile';
import { UserSkillDb } from '../models/UserSkillsSchema';
import { ICsvSkillsErrors, ICsvValidation, IUserSkills } from '../types';
import { validateHeader, validateRow } from '../validators/validationUserSkills';
import { handleEmail } from '../utils/handleEmail';
import { generateToken } from '../utils/generateToken';
import { UserDb } from '../models/UserSchema';
import { registerUserEmailTemplate } from '../templates/registerUserEmailTemplate';
import { registerHrEmailTemplate } from '../templates/registerHrEmailTemplate';
import { filterAdmin, filterHr } from '../utils/filterResponse';
import { randomPassword } from '../utils/randomPassword';
import sanitizeHtml from 'sanitize-html';
import { ValidationError } from '../utils/handleError';

export const validateUserSkills = async (req: Request, res: Response, next: NextFunction) => {
  const csvFile = req.file;
  if (!csvFile) throw new ValidationError('Nie przesłano żadnego pliku CSV.');

  try {
    const csv = await readFile(path.join(storageDir(), 'csv', csvFile.filename), 'utf8');
    const {
      meta: { fields },
      data,
    } = parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const headers = validateHeader(fields).filter((header) => header !== null);

    if (headers.length > 0) {
      return res.status(200).send({ errors: headers });
    }

    const emailsFromCsv = data.map((data: IUserSkills) => data.email);

    const duplicateEmails: ICsvValidation[] = emailsFromCsv
      .map((email: string, i: number) => {
        const duplicate = emailsFromCsv.indexOf(email) !== i;
        return duplicate ? { row: i + 1, field: email, message: 'Podany email istnieje już w pliku .csv' } : null;
      })
      .filter((data) => data !== null);

    if (duplicateEmails.length > 0) {
      return res.status(200).send({ errors: duplicateEmails });
    }

    const rowsFromCsv = await Promise.all(
      data.map(async (dataCsv: any, i) => {
        const errors = {} as ICsvSkillsErrors;

        for (const key of Object.keys(dataCsv)) {
          errors[key] = await validateRow(key, dataCsv[key], i + 1);
        }

        return Object.values(errors).some((error) => error) ? errors : null;
      })
    );

    const rows = rowsFromCsv.filter((row) => row !== null);

    if (rows.length > 0) {
      return res.status(200).send({ errors: rows });
    }

    res.status(200).send({ ok: true, fileName: csvFile.filename });
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new ValidationError('Nie znaleziono pliku.');
    }
    next(err);
  } finally {
    if (csvFile) {
      await unlink(path.join(storageDir(), 'csv', csvFile.filename));
    }
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

    const addSkills = await Promise.all(
      data.map(async (data: IUserSkills) => {
        const { email, projectDegree, courseCompletion, courseEngagement, teamProjectDegree, bonusProjectUrls } = data;

        const skills = new UserSkillDb({
          email,
          projectDegree,
          courseCompletion,
          courseEngagement,
          teamProjectDegree,
          bonusProjectUrls: bonusProjectUrls
            .toString()
            .split(',')
            .map((d) => d.trim()),
        });

        const newUser = new UserDb({
          email: sanitizeHtml(email),
          password: randomPassword(),
          role: 'Kursant',
        });

        const user = await UserDb.createNewUser(newUser, newUser.role);

        const token = generateToken(user._id, process.env.EXPIRES_REGISTER_TOKEN);
        user.token = token;
        await user.save();

        const link = `${process.env.CORS_ORIGIN}/register/${user._id}/${token}`;

        await handleEmail({
          to: user.email,
          subject: 'Rejestracja użytkownika',
          html: registerUserEmailTemplate(link, email, newUser.password),
        });

        return skills.save();
      })
    );

    if (data.length === addSkills.length) {
      await unlink(path.join(storageDir(), 'csv', fileName));
    } else {
      res.send({ message: 'Nie zgadza się ilość zapisanych danych, spróbuj ponownie.' });
    }

    res.status(201).send(addSkills);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new ValidationError('Nie znaleziono pliku.');
    }
    next(err);
  } finally {
    if (fileName) {
      await unlink(path.join(storageDir(), 'csv', fileName));
    }
  }
};

export const registerHr = async (req: Request, res: Response, next: NextFunction) => {
  const { email, fullName, company, maxReservedStudents } = req.body;

  try {
    const newUser = new UserDb({
      email: sanitizeHtml(email),
      password: randomPassword(),
      role: 'HR',
      fullName,
      company,
      maxReservedStudents,
    });

    const newHr = await UserDb.createNewUser(newUser, newUser.role);

    const link = `${process.env.CORS_ORIGIN}/`;

    await handleEmail({
      to: newHr.email,
      subject: 'Rejestracja użytkownika',
      html: registerHrEmailTemplate(link, email, newUser.password),
    });

    res.status(201).send(filterHr(newHr));
  } catch (err) {
    next(err);
  }
};

export const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    if (req.user._id.toString() !== id) {
      throw new ValidationError('Nie masz dostępu do tego zasobu.');
    }

    const user = await UserDb.findById(id);
    if (!user) throw new ValidationError('Nie znaleziono użytkownika o podanym ID');

    res.status(200).send(filterAdmin(user));
  } catch (err) {
    next(err);
  }
};
