import { Router } from 'express';
import { login, logout, register } from '../controllers/authController';
export const authRouter = Router();

authRouter.post('/register', register).post('/login', login).get('/logout', logout);
