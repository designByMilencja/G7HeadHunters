import * as yup from 'yup';
import { ContractType, Status, TypeWork } from '../types';

export const searchSchema = yup.object().shape({
  search: yup
    .string()
    .matches(/^[\w@.]{3,64}$/, 'Max. 64 znaki, tylko litery, cyfry oraz znak specjalny: @ lub .')
    .required('Uzupełnij pole szukaj.'),
});

export const setStatusSchema = yup.object().shape({
  email: yup.string().email('Proszę podać poprawny adres email.').required('Email jest wymagany zmiany statusu.'),
  status: yup.string().oneOf(Object.values(Status), 'Nie prawidłowy status.').required('Przekaż status do zmiany.'),
});

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
  expectedSalaryFrom: yup
    .number()
    .min(0, 'Minimalna wartość w polu oczekiwane wynagrodzenie to 0')
    .typeError('Dozwolone są tylko liczny w polu oczekiwane wynagrodzenie od')
    .notRequired(),
  expectedSalaryTo: yup
    .number()
    .min(0, 'Minimalna wartość w polu oczekiwane wynagrodzenie to 0')
    .max(99999, 'Maksymalna wartość w polu oczekiwane wynagrodzenie to 99999')
    .typeError('Dozwolone są tylko liczny w polu oczekiwane wynagrodzenie do')
    .notRequired(),
  canTakeApprenticeship: yup.string().oneOf(['TAK', 'NIE'], 'Wybierz prawidłowe dane: "TAK" lub "NIE"').notRequired(),
  monthsOfCommercialExp: yup
    .number()
    .min(0, 'Minimalna liczba miesięcy doświadczenia komercyjnego to 0')
    .integer('Tylko liczby naturalne w polu ilość miesięcy doświadczenia komercyjnego.')
    .typeError('Dozwolone są tylko liczny naturalne w polu ilość miesięcy doświadczenia komercyjnego')
    .notRequired(),
});
