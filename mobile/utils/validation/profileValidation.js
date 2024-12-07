import * as yup from 'yup'

export const profileValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[а-яА-ЯёЁa-zA-Z-]+$/, 'Имя может содержать только буквы и тире.')
    .max(30, 'Имя не может быть длиннее 30 символов.')
    .required('Имя обязательно.'),
  lastName: yup
    .string()
    .matches(
      /^[а-яА-ЯёЁa-zA-Z-]+$/,
      'Фамилия может содержать только буквы и тире.'
    )
    .max(30, 'Фамилия не может быть длиннее 30 символов.')
    .required('Фамилия обязательна.'),
  phone: yup
    .string()
    .matches(
      /^\+?[1-9][0-9]{9,15}$/,
      'Телефон должен содержать от 10 до 15 цифр и может начинаться со знака "+".'
    )
    .required('Телефон обязателен.'),
  address: yup
    .string()
    .matches(
      /^[а-яА-ЯёЁa-zA-Z0-9.,-]+$/,
      'Адрес может содержать буквы, цифры, точки, запятые и тире.'
    )
    .max(50, 'Адрес не может быть длиннее 50 символов.')
    .required('Адрес обязателен.'),
  photo: yup
    .mixed()
    .test(
      'fileFormat',
      'Можно загружать только файлы форматов png, jpg, jpeg, gif.',
      (value) => {
        if (!value || !value.uri) return true
        const extension = value.uri.split('.').pop().toLowerCase()
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif']
        return allowedExtensions.includes(extension)
      }
    )
    .required('Фотография обязательна.'),
})
