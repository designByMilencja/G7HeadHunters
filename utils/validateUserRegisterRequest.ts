import * as yup from 'yup';

const WORKTYPE = ['Na miejscu', 'Gotowość do przeprowadzki', 'Wyłącznie zdalnie', 'Hybrydowo', 'Bez znaczenia'];
const CONTRACTTYPE = ['Tylko UoP', 'Możliwe B2B', 'Możliwe UZ/UoD', 'Brak preferencji'];
export const registerUserSchema = yup.object().shape({
  email: yup.string().email('Proszę podać poprawny adres email.').required('Email jest wymagany do rejestracji.'),
  phone: yup.string().notRequired(),
  firstName: yup.string().required('Imię jest wymagane do rejestracji.'),
  lastName: yup.string().required('Nazwisko jest wymagane do rejestracji.'),
  githubUsername: yup.string().required('Nazwa użytkowania github jest wymagane do rejestracji.'),
  portfolioUrls: yup.array().of(yup.string().url('Nie poprawny adres url')).notRequired(),
  projectUrls: yup
    .array()
    .of(yup.string().matches(/^https?:\/\/(www\.)?github\.com\/.*$/, 'Nie poprawny adres url'))
    .required()
    .min(2, 'Wymagane jest podanie adresów do FE i BE')
    .required('Dodaj adresy url do projektu końcowego'),
  bio: yup.string().notRequired(),
  expectedTypeWork: yup
    .string()
    .oneOf(WORKTYPE, 'Nie prawidłowe miejsce pracy')
    .required('Wybierz preferowane miejsc pracy'),
  targetWorkCity: yup.string().notRequired(),
  expectedContractType: yup
    .string()
    .oneOf(CONTRACTTYPE, 'Nie prawidłowe typ kontraktu')
    .required('Wybierz preferowane typ kontraktu'),
  expectedSalary: yup.string().notRequired(),
  canTakeApprenticeship: yup
    .string()
    .oneOf(['TAK', 'NIE'], 'Wybierz prawidłowe dane: "TAK" lub "NIE"')
    .required('Wybierz czy zgadzasz się na odbycie bezpłatnego stażu.'),
  monthsOfCommercialExp: yup
    .number()
    .positive('Tylko liczby dodanie')
    .integer('Tylko liczby naturalne')
    .typeError('Dozwolone są tylko liczny naturalne')
    .notRequired(),
  education: yup.string().notRequired(),
  workExperience: yup.string().notRequired(),
  courses: yup.string().notRequired(),
});
