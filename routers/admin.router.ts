import { Router } from 'express';
import { upload } from '../utils/handleFile';
import { validation } from '../middlewares/validation';
import { registerHrSchema } from '../middlewares/validation-schama';
import { verifyCookie } from '../middlewares/auth';
import { getAdmin, registerHr, saveUserSkills, validateUserSkills } from '../controllers/adminController';
import { verifyRole } from '../middlewares/checkRole';
import { Role } from '../types';

export const adminRouter = Router();

adminRouter
  .post('/validate-csv', verifyCookie, verifyRole(Role.admin), upload.single('csvFile'), validateUserSkills)
  .post('/save-csv', verifyCookie, verifyRole(Role.admin), saveUserSkills)
  .post('/register-hr', verifyCookie, verifyRole(Role.admin), validation(registerHrSchema), registerHr)
  .get('/:id', verifyCookie, verifyRole(Role.admin), getAdmin);
