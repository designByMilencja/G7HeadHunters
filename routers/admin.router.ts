import { Router } from 'express';
import { upload } from '../utils/handleFile';
import { validation } from '../middlewares/validation';
import { registerHrSchema } from '../utils/validateHrRegisterRequest';
import { verifyCookie } from '../middlewares/auth';
import { getAdmin, registerHr, saveUserSkills, validateUserSkills } from '../controllers/adminController';
import { ROLES, verifyRole } from '../middlewares/checkRole';

export const adminRouter = Router();

adminRouter
  .post('/validate-csv', verifyCookie, verifyRole(ROLES.admin), upload.single('csvFile'), validateUserSkills)
  .post('/save-csv', verifyCookie, verifyRole(ROLES.admin), saveUserSkills)
  .post('/register-hr', verifyCookie, verifyRole(ROLES.admin), validation(registerHrSchema), registerHr)
  .get('/:id', verifyCookie, verifyRole(ROLES.admin), getAdmin);
