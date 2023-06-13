import { Router } from 'express';
import { changePassword, forgotPassword, login, logout, updatePassword } from '../controllers/authController';
import { verifyCookie } from '../middlewares/auth';
import { validation } from '../middlewares/validation';
import { checkPwdSchema } from '../validators/validationAuthSchama';

export const authRouter = Router();

authRouter
  .post('/login', login)
  .get('/logout', verifyCookie, logout)
  .post('/reset-password', forgotPassword)
  .patch('/update-password', validation(checkPwdSchema), updatePassword)
  .patch('/change-password/:id', verifyCookie, validation(checkPwdSchema), changePassword);
