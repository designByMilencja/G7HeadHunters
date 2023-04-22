import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { hashPwd } from '../utils/hashPwd';
import { AdminDb } from '../models/AdminSchema';
import { UserDb } from '../models/UserSchema';
import { HrDb } from '../models/HrSchema';
import { ValidationError } from '../utils/handleError';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const newUser = new UserDb({
    email,
    password: await hashPwd(password),
    role: 'Kursant',
  });

  const savedUser = await newUser.save();

  res.status(201).send(savedUser); //@TODO zrobić filtrowanie jak zostanie dodany typ UserRepsonse (bez hasła i tokena)
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await UserDb.findOne({ email });
  if (!user) user = await HrDb.findOne({ email });
  if (!user) user = await AdminDb.findOne({ email });

  if (!user) throw new ValidationError('User not found');

  const isMatch = await bcrypt.compare(password, await user.password);
  if (!isMatch) throw new ValidationError('Wrong password');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });

  user.token = token;
  const savedUser = await user.save();

  res
    .cookie('token', token, {
      secure: false, //true jeżeli https
      domain: 'localhost',
      httpOnly: true,
    })
    .send(savedUser); //@TODO zrobić filtrowanie jak zostanie dodany typ UserRepsonse (bez hasła i tokena)
};

export const logout = async (req: Request, res: Response) => {
  let user = await UserDb.findOne({ token: req.cookies.token });
  if (!user) user = await HrDb.findOne({ token: req.cookies.token });
  if (!user) user = await AdminDb.findOne({ token: req.cookies.token });

  if (!user) throw new ValidationError('User not found');

  user.token = null;
  await user.save();

  res.clearCookie('token', {
    secure: false, //true jeżeli https
    domain: 'localhost',
    httpOnly: true,
  });

  res.send('Logout successful');
};
