import { Router } from 'express';
import { addUserProfile, getUser, updateUserProfile } from '../controllers/userController';
import { verifyCookie } from '../middlewares/auth';
import { validation } from '../middlewares/validation';
import { registerUserSchema } from '../utils/validateUserRegisterRequest';
import { ROLES, verifyRole } from '../middlewares/checkRole';

export const userRouter = Router();

userRouter
  .get('/:id', verifyCookie, verifyRole(ROLES.user), getUser)
  .post('/:id', verifyCookie, verifyRole(ROLES.user), validation(registerUserSchema), addUserProfile)
  .put('/:id', verifyCookie, verifyRole(ROLES.user), validation(registerUserSchema), updateUserProfile);
