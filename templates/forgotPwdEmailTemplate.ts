export const forgotPwdEmailTemplate = (url: string) => {
  return `
    <h1>Zresetuj hasło</h1>
    <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.</p>
    <p>Kliknij poniższy przycisk, aby zresetować hasło:</p>
    <a href="${url}">Zresetuj hasło</a>
    <p>Jeśli prośba o zresetowanie hasła nie pochodziła od Ciebie, możesz bezpiecznie zignorować tę wiadomość e-mail.</p>
    `;
};
