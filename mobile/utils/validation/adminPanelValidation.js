import * as Yup from 'yup'

export const createBrandValidationSchema = Yup.object().shape({
  brand: Yup.string()
    .max(20, 'Название типа не должно превышать 20 символов')
    .required('Название типа обязательно'),
})

export const createTypeValidationSchema = Yup.object().shape({
  type: Yup.string()
    .max(20, 'Название типа не должно превышать 20 символов')
    .required('Название типа обязательно'),
})

export const createDeviceValidationSchema = Yup.object().shape({
  name: Yup.string()
    .max(25, 'Название устройства не должно превышать 25 символов')
    .required('Название устройства обязательно'),
  price: Yup.string()
    .max(20, 'Стоимость не должна превышать 20 символов')
    .required('Стоимость устройства обязательна'),
  file: Yup.object()
    .shape({
      uri: Yup.string().required('Фотография устройства обязательна'),
      name: Yup.string(),
      type: Yup.string(),
    })
    .nullable()
    .required('Фотография устройства обязательна')
    .test(
      'fileType',
      'Неверный формат файла (поддерживаются jpeg, jpg, png, gif)',
      (value) => {
        return (
          !value ||
          (value &&
            ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(
              value.type
            ))
        )
      }
    ),
})
