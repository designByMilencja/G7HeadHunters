import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserDb } from '../models/UserSchema';
import { handleEmail } from '../utils/handleEmail';
import { forgotPwdEmailTemplate } from '../templates/forgotPwdEmailTemplate';
import { generateToken } from '../utils/generateToken';
import { filterAdmin, filterHr, filterUser } from '../utils/filterResponse';
import { ValidationError } from '../utils/handleError';
import { DecodedToken } from '../types';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await UserDb.findOne({ email });
    if (!user) throw new ValidationError(`Użytkownik o emailu: ${email} nie istnieje.`);
    if (user.role === 'Kursant' && !user.active) {
      return res.status(403).send({ message: 'Użytkownik nie jest jeszcze aktywny.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ValidationError('Niepoprawny email lub hasło');

    const token = generateToken(user._id, process.env.EXPIRES_TOKEN);
    user.token = token;
    const savedUser = await user.save();

    let filteredResponse;
    if (user.role === 'Kursant') filteredResponse = filterUser(savedUser);
    if (user.role === 'HR') filteredResponse = filterHr(savedUser);
    if (user.role === 'Admin') filteredResponse = filterAdmin(savedUser);

    res
      .status(200)
      .cookie('token', token, {
        secure: process.env.COOKIE_SECURE === 'true',
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: true,
      })
      .send(filteredResponse);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  try {
    const user = await UserDb.findOne({ token });
    if (!user) throw new ValidationError('Nie znaleziono użytkownika.');

    user.token = null;
    await user.save();

    res
      .status(200)
      .clearCookie('token', {
        secure: process.env.COOKIE_SECURE === 'true',
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: true,
      })
      .send({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const user = await UserDb.findOne({ email });
    if (!user) throw new ValidationError(`Użytkownik o emailu: ${email} nie istnieje.`);

    const token = generateToken(user._id, process.env.EXPIRES_FORGOT_PWD_TOKEN);
    user.token = token;
    await user.save();

    const link = `${process.env.CORS_ORIGIN}/reset-password/${token}`;

    await handleEmail({
      to: user.email,
      subject: 'Zresetuj hasło',
      html: forgotPwdEmailTemplate(link),
    });

    res.status(200).send({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token, password } = req.body;

  try {
    if (!token) throw new ValidationError('Nie przesłano tokena.');

    jwt.verify(token, process.env.JWT_SECRET, (err: jwt.VerifyErrors) => {
      if (err) {
        return res.status(403).send({ message: 'Nieprawidłowy token.' });
      }
    });

    const user = await UserDb.findOne({ token });
    if (!user) throw new ValidationError('Nie znaleziono użytkownika.');

    user.password = password;
    user.token = null;
    await user.save();

    res.status(200).send({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  const { id } = req.params;

  try {
    const user = await UserDb.findById(id);
    if (!user) throw new ValidationError('Nie znaleziono użytkownika o podanym ID.');

    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err: jwt.VerifyErrors, decoded: DecodedToken) => {
      if (err) {
        return res.status(403).send({ message: 'Nieprawidłowy token.' });
      }
      if (decoded._id !== id) {
        return res.status(401).send({ message: 'Nieautoryzowany użytkownik.' });
      }
    });

    user.password = password;
    const savedUser = await user.save();

    let filteredResponse;
    if (user.role === 'Kursant') filteredResponse = filterUser(savedUser);
    if (user.role === 'HR') filteredResponse = filterHr(savedUser);
    if (user.role === 'Admin') filteredResponse = filterAdmin(savedUser);

    res.status(200).json(filteredResponse);
  } catch (err) {
    next(err);
  }
};
