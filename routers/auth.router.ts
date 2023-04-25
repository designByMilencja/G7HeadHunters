import { Router } from 'express';
import { login, logout, register } from '../controllers/authController';
import { verifyCookie } from '../middlewares/auth';
export const authRouter = Router();

authRouter.post('/register', register).post('/login', login).get('/logout', verifyCookie, logout);
