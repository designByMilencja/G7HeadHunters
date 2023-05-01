import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';

export const validation = (schema: yup.Schema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).send({ message: err.errors[0] });
  }
};
