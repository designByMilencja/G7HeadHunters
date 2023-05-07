import { ValidationError } from './handleError';

export const getGitHubUser = async (username: string) => {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new ValidationError(`Użytkownik ${username} nie istnieje w serwisie github.`);
  }

  const data = await response.json();
  return data.avatar_url;
};
