import { createTransport } from 'nodemailer';
import { ValidationError } from './handleError';
interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  html: string;
}

export const handleEmail = async (options: EmailOptions) => {
  const { to, subject, html } = options;

  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PWD,
    },
  });

  const emailData = {
    from: '<from@example.com>',
    to,
    subject,
    html,
  };

  await transporter.sendMail(emailData, (err) => {
    if (err) throw new ValidationError(err.message);
  });
};
