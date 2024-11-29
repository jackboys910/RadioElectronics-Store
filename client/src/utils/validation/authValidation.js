import * as Yup from 'yup'

export const registrationValidationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9.-]+@(gmail\.com|mail\.ru|inbox\.ru|bk\.ru|list\.ru|internet\.ru|xmail\.ru|yandex\.ru|yahoo\.com|hotmail\.com|outlook\.com)$/,
      'Такого почтового домена не существует'
    )
    .required('Email обязателен'),
  password: Yup.string().required('Пароль обязателен'),
})

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required('Email обязателен'),
  password: Yup.string().required('Пароль обязателен'),
})
