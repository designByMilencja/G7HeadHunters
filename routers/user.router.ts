import { Router } from 'express';
import { addUserProfile, getUser, updateUserProfile } from '../controllers/userController';
import { verifyCookie } from '../middlewares/auth';
import { validation } from '../middlewares/validation';
import { registerUserSchema } from '../middlewares/validation-schama';
import { verifyRole } from '../middlewares/checkRole';
import { Role } from '../types';

export const userRouter = Router();

userRouter
  .get('/:id', verifyCookie, verifyRole(Role.user), getUser)
  .post('/:id/:token', validation(registerUserSchema), addUserProfile)
  .put('/:id', verifyCookie, verifyRole(Role.user), validation(registerUserSchema), updateUserProfile);
