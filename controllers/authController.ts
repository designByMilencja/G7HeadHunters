import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { hashPwd } from '../utils/hashPwd';
import { UserDb } from '../models/UserSchema';
import { handleEmail } from '../utils/handleEmail';
import { forgotPwdEmailTemplate } from '../templates/forgotPwdEmailTemplate';
import { ValidationError } from '../utils/handleError';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const newUser = new UserDb({
    email,
    password: await hashPwd(password),
    role: 'Kursant',
  });

  const savedUser = await UserDb.createNewUser(newUser, newUser.role);

  res.status(201).send(savedUser); //@TODO zrobić filtrowanie jak zostanie dodany typ UserResponse (bez hasła i tokena)
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await UserDb.findOne({ email });
    if (!user) throw new ValidationError('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ValidationError('Incorrect email or password');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_TOKEN,
    });

    user.token = token;
    const savedUser = await user.save();

    res
      .cookie('token', token, {
        secure: false, //true jeżeli https
        domain: 'localhost',
        httpOnly: true,
      })
      .send(savedUser); //@TODO zrobić filtrowanie jak zostanie dodany typ UserResponse (bez hasła i tokena)
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserDb.findOne({ token: req.cookies.token });
    if (!user) throw new ValidationError('User not found');

    user.token = null;
    await user.save();

    res
      .clearCookie('token', {
        secure: false, //true jeżeli https
        domain: 'localhost',
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
    if (!user) throw new ValidationError('User not found');

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    user.token = token;
    await user.save();

    const link = `${process.env.CORS_ORIGIN}/reset-password/${token}`;

    await handleEmail({
      to: user.email,
      subject: 'Reset pasasword',
      html: forgotPwdEmailTemplate(link),
    });

    res.send({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token, password } = req.body;

  try {
    if (!token) throw new ValidationError('Token not exist');

    jwt.verify(token, process.env.JWT_SECRET, (err: jwt.VerifyErrors) => {
      if (err) {
        return res.status(403).send({ message: 'Invalid token' });
      }
    });

    const user = await UserDb.findOne({ token });
    if (!user) throw new ValidationError('User not found');

    user.password = await hashPwd(password);
    user.token = null;
    await user.save();

    res.send({ ok: true });
  } catch (err) {
    next(err);
  }
};
