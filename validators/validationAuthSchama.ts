import * as yup from 'yup';

export const checkPwdSchema = yup.object().shape({
  password: yup
    .string()
    .matches(/^(?!.*[<>]).{8,}$/, 'Min. 8 znaków, litery, liczby lub znak specjalny, poza < lub >')
    .required('Uzupełnij pole hasło.'),
});
