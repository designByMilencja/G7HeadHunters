import { Router } from 'express';
import { availableUsers, filterUsers, reservedUsers, searchUsers, setStatus } from '../controllers/hrController';
import { verifyCookie } from '../middlewares/auth';
import { ROLES, verifyRole } from '../middlewares/checkRole';
import { validation } from '../middlewares/validation';
import { setStatusSchema } from '../utils/validateSetStatus';

export const hrRouter = Router();

hrRouter
  .get('/', verifyCookie, verifyRole(ROLES.hr), availableUsers)
  .get('/search', verifyCookie, verifyRole(ROLES.hr), searchUsers)
  .get('/filter', verifyCookie, verifyRole(ROLES.hr), filterUsers)
  .get('/:id', verifyCookie, verifyRole(ROLES.hr), reservedUsers)
  .patch('/status/:id', verifyCookie, verifyRole(ROLES.hr), validation(setStatusSchema), setStatus);
