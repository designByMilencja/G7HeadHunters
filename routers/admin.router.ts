import { Router } from 'express';
import { upload } from '../utils/handleFile';
import { validateUserSkills, saveUserSkills } from '../controllers/adminController';

export const adminRouter = Router();

adminRouter.post('/validate-csv', upload.single('csvFile'), validateUserSkills).post('/save-csv', saveUserSkills);
