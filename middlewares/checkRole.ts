import { NextFunction, Request, Response } from 'express';

export enum ROLES {
  admin = 'Admin',
  user = 'Kursant',
  hr = 'HR',
}
export const verifyRole = (role: ROLES) => (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== role) {
    return res.status(403).send({ message: 'Access denied' });
  }
  next();
};
