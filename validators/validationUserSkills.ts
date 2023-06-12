import { HEADERFIELDS, ICsvValidation } from '../types';
import { UserDb } from '../models/UserSchema';

export const validateHeader = (header: string[]): ICsvValidation[] | null => {
  return header.map((field) => {
    if (!HEADERFIELDS.includes(field)) {
      return { field: field, error: true, message: 'Nieprawidłowy nagłówek.' };
    }
    return null;
  });
};
export const validateRow = async (
  key: string,
  field: string,
  row: number
): Promise<ICsvValidation | ICsvValidation[] | undefined> => {
  if (key === 'bonusProjectUrls') {
    const errorUrl: ICsvValidation[] = [];

    if (field.length === 0) {
      errorUrl.push({ row, field: '', message: 'Brak danych' });
    } else {
      for (const url of field.split(',')) {
        if (!url.trim().match(/^https?:\/\/(www\.)?github\.com\/.*$/i)) {
          errorUrl.push({ row, field: url, message: 'Błędne adres url do repozytorium github.' });
        }
      }
    }

    return errorUrl.length > 0 ? errorUrl : undefined;
  }

  if (key === 'email') {
    if (!field || !field.match(/^(.+)@(.+)$/)) {
      return { row, field, message: 'Nieprawidłowy adres email.' };
    }

    const existUser = await UserDb.findOne({ email: field, role: 'Kursant' }).lean().exec();

    if (existUser && existUser.active === true) {
      return { row, field, message: 'Użytkownik jest już zarejestrowany w serwisie.' };
    }

    return undefined;
  }

  if (!field || field.length > 1 || isNaN(parseInt(field)) || Number(field) < 0 || Number(field) > 5) {
    return { row, field, message: 'Nieprawidłowe dane.' };
  }
  return undefined;
};
