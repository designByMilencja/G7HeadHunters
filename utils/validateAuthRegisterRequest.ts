import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  email: yup.string().email('Proszę podać poprawny adres email.').required('Email jest wymagany do rejestracji.'),
  password: yup
    .string()
    .matches(/^.{8,}$/, 'Hasło musi zawierać co najmniej 8 znaków.')
    .required('Hasło jest wymagane do rejestracji.'),
});
