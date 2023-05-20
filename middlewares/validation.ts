import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';

export const validation = (schema: yup.Schema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = !req.body || Object.keys(req.body).length === 0 ? req.query : req.body;

    await schema.validate(data);
    next();
  } catch (err) {
    res.status(400).send({ message: err.errors[0] });
  }
};
