import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { hashPwd } from '../utils/hashPwd';
import { UserDb } from '../models/UserSchema';
import { handleEmail } from '../utils/handleEmail';
import { forgotPwdEmailTemplate } from '../templates/forgotPwdEmailTemplate';
import { genToken } from '../utils/token';
import { filterAdmin, filterHr, filterUser } from '../utils/filterRespons';
import { ValidationError } from '../utils/handleError';

interface DecodedToken extends JwtPayload {
  _id: string;
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await UserDb.findOne({ email });
    if (!user) throw new ValidationError('User not found');
    if (user.role === 'Kursant' && !user.active) {
      return res.status(403).send({ message: 'User not active' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ValidationError('Incorrect email or password');

    const token = genToken(user._id, process.env.EXPIRES_TOKEN);
    user.token = token;
    const savedUser = await user.save();

    let filteredResponse;
    if (user.role === 'Kursant') filteredResponse = filterUser(savedUser);
    if (user.role === 'HR') filteredResponse = filterHr(savedUser);
    if (user.role === 'Admin') filteredResponse = filterAdmin(savedUser);

    res
      .status(200)
      .cookie('token', token, {
        secure: false, //true jeżeli https
        domain: 'localhost',
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
    if (!user) throw new ValidationError('User not found');

    user.token = null;
    await user.save();

    res
      .status(200)
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

    const token = genToken(user._id, process.env.EXPIRES_FORGOT_PWD_TOKEN);
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
    if (!user) throw new ValidationError('User not found');

    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err: jwt.VerifyErrors, decoded: DecodedToken) => {
      if (err) {
        return res.status(403).send({ message: 'Invalid token' });
      }
      if (decoded._id !== id) {
        return res.status(400).send({ message: 'Token not match to user' });
      }
    });

    user.password = await hashPwd(password);
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
