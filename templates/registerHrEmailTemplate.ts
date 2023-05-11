export const registerHrEmailTemplate = (url: string, user: string, pwd: string) => {
  return `
    <h1>Zaloguj się</h1>
    <p>Kliknij poniższy przycisk, aby przejść do strony logownia:</p>
    <a href="${url}">Link do zalogowania</a>
    <p>&nbsp;</p>
    <h3>Dane do logowania:</h3>
    <p>Nazwa użytkownika: <strong>${user}</strong></p>
    <p>Hasło: <strong>${pwd}</strong></p>
    <p>&nbsp;</p>
    <p>W celu zalogowania się do portalu proszę wprowadzić nazwę użytkownika oraz hasło podane powyżej.</p>
    <small>Sugerujemy zmianę hasła po zalogowaniu.</small>
    `;
};
