import { HEADERFIELDS, ICsvValidation } from '../types/user-skills';
import { UserDb } from '../models/UserSchema';

export const validateHeader = (header: string[]): ICsvValidation[] | null => {
  return header.map((field) => {
    if (!HEADERFIELDS.includes(field)) {
      return { field: field, error: true, message: 'Błędne nagłówek' };
    }
    return null;
  });
};
export const validateRow = (field: string, row: number): ICsvValidation | undefined => {
  if (!field || field.length > 1 || isNaN(parseInt(field)) || Number(field) < 0 || Number(field) > 5) {
    return { row, field: field, message: 'Błędne dane' };
  }
  return undefined;
};

export const validateRowUrls = (urls: string, row: number): ICsvValidation[] | undefined => {
  const errorUrl: ICsvValidation[] = [];

  if (urls.length === 0) {
    errorUrl.push({ row, field: '', message: 'Brak danych' });
  } else {
    for (const url of urls.split(',')) {
      if (!url.trim().match(/^https?:\/\/(www\.)?github\.com\/.*$/i)) {
        errorUrl.push({ row, field: url, message: 'Błędne adres url do repozytorium' });
      }
    }
  }

  return errorUrl.length > 0 ? errorUrl : undefined;
};

export const validateRowEmail = async (
  email: string,
  row: number,
  emailsFromCsv: ICsvValidation[]
): Promise<ICsvValidation | undefined> => {
  if (!email || !email.match(/^(.+)@(.+)$/)) {
    return { row, field: email, message: 'Błędny email' };
  }

  if (emailsFromCsv.length > 0 && emailsFromCsv.some((data) => data.row === row)) {
    return { row, field: email, message: 'Ten email już istnieje' };
  }

  const existUser = await UserDb.findOne({ email: email, role: 'Kursant' });

  if (!existUser) {
    return { row, field: email, message: 'Użytkownik nie istnieje w bazie danych' };
  }

  if (existUser && existUser.active === true) {
    return { row, field: email, message: 'Użytkownik jest już zarejestrowany w serwisie' };
  }

  return undefined;
};
