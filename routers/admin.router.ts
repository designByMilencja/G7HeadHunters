import { Router } from 'express';
import { upload } from '../utils/handleFile';
import { validation } from '../middlewares/validation';
import { registerHrSchema } from '../validators/validationAdminSchama';
import { verifyCookie } from '../middlewares/auth';
import { getAdmin, registerHr, saveUserSkills, validateUserSkills } from '../controllers/adminController';
import { verifyRole } from '../middlewares/checkRole';
import { Role } from '../types';

export const adminRouter = Router();

adminRouter
  .post('/validate-csv', verifyCookie, verifyRole(Role.ADMIN), upload.single('csvFile'), validateUserSkills)
  .post('/save-csv', verifyCookie, verifyRole(Role.ADMIN), saveUserSkills)
  .post('/register-hr', verifyCookie, verifyRole(Role.ADMIN), validation(registerHrSchema), registerHr)
  .get('/:id', verifyCookie, verifyRole(Role.ADMIN), getAdmin);
