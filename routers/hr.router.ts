import { Router } from 'express';
import { availableUsers, reservedUsers, searchUsers, setStatus } from '../controllers/hrController';
import { verifyCookie } from '../middlewares/auth';
import { ROLES, verifyRole } from '../middlewares/checkRole';

export const hrRouter = Router();

hrRouter
  .get('/', verifyCookie, verifyRole(ROLES.hr), availableUsers)
  .get('/search', verifyCookie, verifyRole(ROLES.hr), searchUsers)
  .get('/:id', verifyCookie, verifyRole(ROLES.hr), reservedUsers)
  .patch('/status/:id', verifyCookie, verifyRole(ROLES.hr), setStatus);
