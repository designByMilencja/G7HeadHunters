import { Router } from 'express';
import { addUserProfile, getUser, updateUserProfile } from '../controllers/userController';
import { verifyCookie } from '../middlewares/auth';
import { validation } from '../middlewares/validation';
import { registerUserSchema } from '../validators/validationUserSchama';
import { verifyRole } from '../middlewares/checkRole';
import { Role } from '../types';

export const userRouter = Router();

userRouter
  .get('/:id', verifyCookie, verifyRole(Role.USER), getUser)
  .post('/:id/:token', validation(registerUserSchema), addUserProfile)
  .put('/:id', verifyCookie, verifyRole(Role.USER), validation(registerUserSchema), updateUserProfile);
