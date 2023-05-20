export const employedEmailTemplate = (user: string, hr: string) => {
  return `
    <h1>Kursant został zatrudniony!!!</h1>
    <p>${user} został zatrudniony przez ${hr}</p>
    `;
};
