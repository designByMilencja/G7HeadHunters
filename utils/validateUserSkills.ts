import { HEADERFIELDS, ICsvHeaderErrors, ICsvValidation } from '../types/user-skills';
import { UserDb } from '../models/UserSchema';

export const validateHeader = (header: string[]): ICsvHeaderErrors[] => {
  return header.map((field) => {
    if (!HEADERFIELDS.includes(field)) {
      return { field, errors: { field: field, error: true, message: 'Błędne nagłówek' } };
    }
    return { field, errors: undefined };
  });
};
export const validateRow = (field: string): ICsvValidation | undefined => {
  if (!field || isNaN(parseInt(field)) || Number(field) < 0 || Number(field) > 5) {
    return { field: field, error: true, message: 'Błędne dane' };
  }
  return undefined;
};

export const validateRowUrls = (urls: string): ICsvValidation[] | undefined => {
  const urlRegex = /^https?:\/\/(www\.)?github\.com\/.*$/i;

  const errorUrl: ICsvValidation[] = [];

  if (urls.length > 0) {
    for (const url of urls.split(',')) {
      if (!url.trim().match(urlRegex)) {
        errorUrl.push({ field: url, error: true, message: 'Błędne adres url' });
      }
    }
  }

  return errorUrl.length > 0 ? errorUrl : undefined;
};

export const validateRowEmail = async (email: string): Promise<ICsvValidation | undefined> => {
  if (!email || !email.match(/^(.+)@(.+)$/)) {
    return { field: email, error: true, message: 'Błędny email' };
  } else {
    const existUser = await UserDb.findOne({ email: email, role: 'Kursant' });
    if (!existUser) {
      return { field: email, error: true, message: 'Użytkownik nie istnieje w bazie danych' };
    }
  }
  return undefined;
};
