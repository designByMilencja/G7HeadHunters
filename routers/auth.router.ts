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
export const authRouter = Router();

authRouter
  .post('/register', registerUser)
  .post('/register-hr', registerHr)
  .post('/login', login)
  .get('/logout', verifyCookie, logout)
  .post('/reset-password', forgotPassword)
  .patch('/update-password', updatePassword)
  .patch('/change-password', verifyCookie, changePassword);
