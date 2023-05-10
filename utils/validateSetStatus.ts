import * as yup from 'yup';
const STATUS = ['Dostępny', 'W trakcie rozmowy', 'Zatrudniony'];
export const setStatusSchema = yup.object().shape({
  email: yup.string().email('Proszę podać poprawny adres email.').required('Email jest wymagany zmiany statusu.'),
  status: yup.string().oneOf(STATUS, 'Nie prawidłowy status.').required('Przekaż status do zmiany.'),
});
