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
    .matches(/^\+?[0-9]*$/, 'Телефон может содержать только цифры и знак "+".')
    .max(16, 'Телефон не может быть длиннее 16 символов.')
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
        if (!value) return true
        const allowedFormats = [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'image/gif',
        ]
        return allowedFormats.includes(value.type)
      }
    ),
})
