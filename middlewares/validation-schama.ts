import * as yup from 'yup';
import { ContractType, Status, TypeWork } from '../types';

export const filterUsersSchema = yup.object().shape({
  courseCompletion: yup
    .number()
    .min(0, 'Minimalna ocena ukończenia kursu to 0')
    .max(5, 'Maksymalna ocena ukończenia kursu to 5')
    .integer('Tylko liczby naturalne w polu oceny ukończenia kursu.')
    .typeError('Dozwolone są tylko liczny naturalne w polu oceny ukończenia kursu.')
    .notRequired(),
  courseEngagement: yup
    .number()
    .min(0, 'Minimalna ocena aktywności w kursie to 0')
    .max(5, 'Maksymalna ocena aktywności w kursie to 5')
    .integer('Tylko liczby naturalne w polu oceny aktywności w kursie.')
    .typeError('Dozwolone są tylko liczny naturalne w polu oceny aktywności w kursie.')
    .notRequired(),
  projectDegree: yup
    .number()
    .min(0, 'Minimalna ocena z zadania zaliczeniowego w kursie to 0')
    .max(5, 'Maksymalna ocena z zadania zaliczeniowego w kursie to 5')
    .integer('Tylko liczby naturalne w polu z zadania zaliczeniowego w kursie.')
    .typeError('Dozwolone są tylko liczny naturalne w polu z zadania zaliczeniowego w kursie.')
    .notRequired(),
  teamProjectDegree: yup
    .number()
    .min(0, 'Minimalna ocena z pracy w zespole przy projekcie bonusowym to 0')
    .max(5, 'Maksymalna ocena z pracy w zespole przy projekcie bonusowym to 5')
    .integer('Tylko liczby naturalne w polu z oceny pracy w zespole przy projekcie bonusowym.')
    .typeError('Dozwolone są tylko liczny naturalne w polu z oceny pracy w zespole przy projekcie bonusowym.')
    .notRequired(),
  expectedTypeWork: yup
    .string()
    .oneOf(Object.values(TypeWork), 'Nie prawidłowe dane w polu oczekiwane miejsce pracy.')
    .notRequired(),
  expectedContractType: yup
    .string()
    .oneOf(Object.values(ContractType), 'Nie prawidłowe dane w polu typ kontraktu')
    .notRequired(),
  expectedSalaryFrom: yup.number().min(0, 'Minimalna wartość w polu oczekiwana wypłata to 0').notRequired(),
  expectedSalaryTo: yup.number().min(0, 'Minimalna wartość w polu oczekiwana wypłata to 0').notRequired(),
  canTakeApprenticeship: yup.string().oneOf(['TAK', 'NIE'], 'Wybierz prawidłowe dane: "TAK" lub "NIE"').notRequired(),
  monthsOfCommercialExp: yup
    .number()
    .min(0, 'Minimalna liczba miesięcy doświadczenia komercyjnego to 0')
    .integer('Tylko liczby naturalne w polu ilość miesięcy doświadczenia komercyjnego.')
    .typeError('Dozwolone są tylko liczny naturalne w polu ilość miesięcy doświadczenia komercyjnego')
    .notRequired(),
});

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

export const setStatusSchema = yup.object().shape({
  email: yup.string().email('Proszę podać poprawny adres email.').required('Email jest wymagany zmiany statusu.'),
  status: yup.string().oneOf(Object.values(Status), 'Nie prawidłowy status.').required('Przekaż status do zmiany.'),
});

export const registerUserSchema = yup.object().shape({
  email: yup.string().email('Proszę podać poprawny adres email.').required('Email jest wymagany do rejestracji.'),
  phone: yup.string().notRequired(),
  firstName: yup.string().required('Imię jest wymagane do rejestracji.'),
  lastName: yup.string().required('Nazwisko jest wymagane do rejestracji.'),
  githubUsername: yup.string().required('Nazwa użytkowania github jest wymagane do rejestracji.'),
  portfolioUrls: yup.array().of(yup.string().url('Nie poprawny adres url do Twojego portfolio')).notRequired(),
  projectUrls: yup
    .array()
    .of(yup.string().matches(/^https?:\/\/(www\.)?github\.com\/.*$/, 'Nie poprawny adres url projektu końcowego'))
    .required()
    .min(2, 'Wymagane jest podanie adresów do projektu na FE i BE')
    .required('Dodaj adresy url do projektu końcowego'),
  bio: yup.string().notRequired(),
  expectedTypeWork: yup
    .string()
    .oneOf(Object.values(TypeWork), 'Nie prawidłowe dane w polu oczekiwane miejsce pracy.')
    .required('Wybierz preferowane miejsc pracy'),
  targetWorkCity: yup.string().notRequired(),
  expectedContractType: yup
    .string()
    .oneOf(Object.values(ContractType), 'Nie prawidłowe dane w polu typ kontraktu')
    .required('Wybierz preferowane typ kontraktu'),
  expectedSalary: yup.string().notRequired(),
  canTakeApprenticeship: yup
    .string()
    .oneOf(['TAK', 'NIE'], 'Wybierz prawidłowe dane: "TAK" lub "NIE"')
    .required('Wybierz czy zgadzasz się na odbycie bezpłatnego stażu.'),
  monthsOfCommercialExp: yup
    .number()
    .min(0, 'Minimalna liczba miesięcy doświadczenia komercyjnego to 0')
    .integer('Tylko liczby naturalne w polu ilość miesięcy doświadczenia komercyjnego.')
    .typeError('Dozwolone są tylko liczny naturalne w polu ilość miesięcy doświadczenia komercyjnego')
    .notRequired(),
  education: yup.string().notRequired(),
  workExperience: yup.string().notRequired(),
  courses: yup.string().notRequired(),
});
