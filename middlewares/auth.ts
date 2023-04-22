import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AdminDb } from '../models/AdminSchema';
import { UserDb } from '../models/UserSchema';
import { HrDb } from '../models/HrSchema';

export const verifyCookie = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies.token ?? null;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err: jwt.VerifyErrors) => {
      if (err) return res.status(403).send('Invalid token');

      let user = await UserDb.findOne({ token });
      if (!user) user = await HrDb.findOne({ token });
      if (!user) user = await AdminDb.findOne({ token });
      if (!user) return res.status(401).send('Unauthorized user');

      req.user = user;
      next();
    });
  } else {
    res.status(403).send('Token not found');
  }
};
