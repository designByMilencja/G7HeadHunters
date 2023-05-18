export const registerUserEmailTemplate = (url: string, user: string, pwd: string) => {
  return `
    <h1>Rejestracja</h1>
    <p>Kliknij poniższy przycisk, aby dokończyć rejestrację użytkownika:</p>
    <a href="${url}">Dokończ rejestrację</a>
    <p>Link będzie aktywny przez 7 dni, po wygaśnieciu proszę skontaktować się z naszym wsparciem technicznym.</p>
    <p>&nbsp;</p>
    <h3>Dane do logowania</h3>
    <p>Nazwa użytkownika: <strong>${user}</strong></p>
    <p>Hasło: <strong>${pwd}</strong></p>
    <p>&nbsp;</p>
    <p>Po dokończeniu rejestracji, w celu zalogowania się do portalu proszę wprowadzić nazwę użytkownika oraz hasło podane powyżej.</p>
    <small>Sugerujemy zmianę hasła po zalogowaniu.</small>
    `;
};
