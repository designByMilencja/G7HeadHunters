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
import { filterUsersSchema, setStatusSchema, searchSchema } from '../validators/validationHrSchama';
import { Role } from '../types';

export const hrRouter = Router();

hrRouter
  .get('/', verifyCookie, verifyRole(Role.HR), availableUsers)
  .get('/search/:id', verifyCookie, verifyRole(Role.HR), validation(searchSchema), searchUsers)
  .get('/filter/:id', verifyCookie, verifyRole(Role.HR), validation(filterUsersSchema), filterUsers)
  .get('/:id', verifyCookie, verifyRole(Role.HR), reservedUsers)
  .patch('/status/:id', verifyCookie, verifyRole(Role.HR), validation(setStatusSchema), setStatus)
  .get('/user/:id/:email', verifyCookie, verifyRole(Role.HR), getUser);
