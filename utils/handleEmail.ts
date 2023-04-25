import { createTransport } from 'nodemailer';
import { ValidationError } from './handleError';
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const handleEmail = async (options: EmailOptions) => {
  const { to, subject, html } = options;

  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PWD,
    },
  });

  const emailData = {
    to,
    subject,
    html,
  };

  await transporter.sendMail(emailData, (err) => {
    if (err) throw new ValidationError(err.message);
  });
};
