import { NextFunction, Request, Response } from 'express';
import { Role } from '../types';

export const verifyRole = (role: Role) => (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== role) {
    return res.status(403).send({ message: 'Brak dostępu.' });
  }
  next();
};
