export const forgotRegisterEmailTemplate = (url: string) => {
  return `
    <h1>Rejestracja</h1>
    <p>Kliknij poniższy przycisk, aby dokończyć rejestrację użytkownika:</p>
    <a href="${url}">Dokończ rejestrację</a>
    <p>Link będzie aktywny przez 7 dni, po wygaśnieciu proszę skontaktować się z naszym wsparciem technicznym.</p>
    `;
};
