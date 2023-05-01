import { Router } from 'express';
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  registerHr,
  registerUser,
  updatePassword,
} from '../controllers/authController';
import { verifyCookie } from '../middlewares/auth';
import { validation } from '../middlewares/validation';
import { registerSchema } from '../utils/validateAuthRegisterRequest';
import { registerHrSchema } from '../utils/validateHrRegisterRequest';
export const authRouter = Router();

authRouter
  .post('/register', validation(registerSchema), registerUser)
  .post('/register-hr', validation(registerHrSchema), registerHr)
  .post('/login', login)
  .get('/logout', verifyCookie, logout)
  .post('/reset-password', forgotPassword)
  .patch('/update-password', updatePassword)
  .patch('/change-password', verifyCookie, changePassword);
