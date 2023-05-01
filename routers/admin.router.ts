import { Router } from 'express';
import { upload } from '../utils/handleFile';
import { validation } from '../middlewares/validation';
import { registerHrSchema } from '../utils/validateHrRegisterRequest';
import { verifyCookie } from '../middlewares/auth';
import { validateUserSkills, saveUserSkills, registerHr } from '../controllers/adminController';

export const adminRouter = Router();

adminRouter
  .post('/validate-csv', upload.single('csvFile'), verifyCookie, validateUserSkills)
  .post('/save-csv', verifyCookie, saveUserSkills)
  .post('/register-hr', validation(registerHrSchema), verifyCookie, registerHr);
