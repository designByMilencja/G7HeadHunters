import * as yup from 'yup';

export const registerHrSchema = yup.object().shape({
  email: yup.string().email('Proszę podać poprawny adres email.').required('Email jest wymagany do rejestracji.'),
  password: yup
    .string()
    .matches(/^.{8,}$/, 'Hasło musi zawierać co najmniej 8 znaków.')
    .required('Hasło jest wymagane do rejestracji.'),
  fullName: yup.string().required('Imię i nazwisko jest wymagane do rejestracji.'),
  company: yup.string().required('Nazwę firmy jest wymagane do rejestracji.'),
});
