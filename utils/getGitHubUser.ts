import { ValidationError } from './handleError';

export const getGitHubUser = async (username: string) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new ValidationError(`Użytkownik ${username} nie istnieje w serwisie github.`);
    }

    const data = await response.json();
    return data.avatar_url || '';
  } catch (err) {
    throw new ValidationError('Problem z potwierdzeniem nazwy użytkownika Github.');
  }
};
