import { Router } from 'express';
import {
  availableUsers,
  filterUsers,
  getUser,
  reservedUsers,
  searchUsers,
  setStatus,
} from '../controllers/hrController';
import { verifyCookie } from '../middlewares/auth';
import { verifyRole } from '../middlewares/checkRole';
import { validation } from '../middlewares/validation';
import { filterUsersSchema, setStatusSchema } from '../middlewares/validation-schama';
import { Role } from '../types';

export const hrRouter = Router();

hrRouter
  .get('/', verifyCookie, verifyRole(Role.hr), availableUsers)
  .get('/search/:id', verifyCookie, verifyRole(Role.hr), searchUsers)
  .get('/filter/:id', verifyCookie, verifyRole(Role.hr), validation(filterUsersSchema), filterUsers)
  .get('/:id', verifyCookie, verifyRole(Role.hr), reservedUsers)
  .patch('/status/:id', verifyCookie, verifyRole(Role.hr), validation(setStatusSchema), setStatus)
  .get('/user/:id/:email', verifyCookie, verifyRole(Role.hr), getUser);
