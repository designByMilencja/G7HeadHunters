import { IAdmin, IHR, IUser } from '../types';
import { filterAdmin, filterHr, filterUser } from './filterResponse';
import { ValidationError } from './handleError';

export const handleRole = (user: IUser | IHR | IAdmin) => {
  switch (user.role) {
    case 'Kursant':
      return filterUser(user as IUser);
    case 'HR':
      return filterHr(user as IHR);
    case 'Admin':
      return filterAdmin(user as IAdmin);
    default:
      throw new ValidationError('Nie zidentyfikowana rola.');
  }
};
