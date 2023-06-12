import * as yup from 'yup';
export const registerHrSchema = yup.object().shape({
  email: yup.string().email('Proszę podać poprawny adres email.').required('Email jest wymagany do rejestracji.'),
  fullName: yup.string().required('Imię i nazwisko jest wymagane do rejestracji.'),
  company: yup.string().required('Nazwę firmy jest wymagane do rejestracji.'),
  maxReservedStudents: yup
    .number()
    .min(1, 'Minimalna liczba osób to 1.')
    .max(999, 'Maksymalna liczba osób 999.')
    .required('Podaj maksymalną liczbę osób umówionych na rozmowę.'),
});
