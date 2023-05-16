import * as yup from 'yup';

const WORKTYPE = ['Na miejscu', 'Gotowość do przeprowadzki', 'Wyłącznie zdalnie', 'Hybrydowo', 'Bez znaczenia'];
const CONTRACTTYPE = ['Tylko UoP', 'Możliwe B2B', 'Możliwe UZ/UoD', 'Brak preferencji'];
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
  expectedTypeWork: yup.string().oneOf(WORKTYPE, 'Nie prawidłowe dane w polu oczekiwane miejsce pracy.').notRequired(),
  expectedContractType: yup.string().oneOf(CONTRACTTYPE, 'Nie prawidłowe dane w polu typ kontraktu').notRequired(),
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
