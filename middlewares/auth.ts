import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserDb } from '../models/UserSchema';

export const verifyCookie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: 'Token not found' });

    jwt.verify(token, process.env.JWT_SECRET, async (err: jwt.VerifyErrors) => {
      if (err) return res.status(403).send('Invalid token');
    });

    const user = await UserDb.findOne({ token });
    if (!user) return res.status(401).send('Unauthorized user');

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
