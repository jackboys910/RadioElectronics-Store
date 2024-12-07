import React, { useContext, useState } from 'react'
import {
  VStack,
  Input,
  Button,
  Text,
  ScrollView,
  FormControl,
  WarningOutlineIcon,
} from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { SHOP_ROUTE } from '../../utils/consts'
import { registration } from '../../http/userAPI'
import { observer } from 'mobx-react-lite'
import { Context } from '../../Context'
import { handleLogin } from '../../utils/handleLogin'
import {
  registrationValidationSchema,
  loginValidationSchema,
} from '../../utils/validation/authValidation'

const Auth = observer(() => {
  const { user, basket } = useContext(Context)
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLogin, setIsLogin] = useState(true)
  // const isLogin = navigation.getState()?.routes?.[0]?.name === LOGIN_ROUTE

  const validationSchema = isLogin
    ? loginValidationSchema
    : registrationValidationSchema

  const validate = async () => {
    try {
      await validationSchema.validate(
        { email, password },
        { abortEarly: false }
      )
      setErrors({})
      return true
    } catch (validationErrors) {
      const validationResult = {}
      validationErrors.inner.forEach((error) => {
        validationResult[error.path] = error.message
      })
      setErrors(validationResult)
      return false
    }
  }

  const click = async () => {
    const isValid = await validate()
    if (!isValid) {
      return
    }

    try {
      if (isLogin) {
        await handleLogin(email, password, user, basket)
      } else {
        const decodedToken = await registration(email, password, basket)
        user.setUser(decodedToken)
        user.setIsAuth(true)
      }
      navigation.navigate(SHOP_ROUTE)
    } catch (e) {
      alert('Ошибка: ' + (e.response?.data?.message || 'Попробуйте позже.'))
      console.error(e)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        marginTop: 80,
        padding: 16,
      }}
    >
      <VStack space={4}>
        <Text fontSize="2xl" textAlign="center">
          {isLogin ? 'Авторизация' : 'Регистрация'}
        </Text>
        <FormControl isInvalid={!!errors.email}>
          <FormControl.Label>Email</FormControl.Label>
          <Input
            placeholder="Введите ваш email..."
            value={email}
            onChangeText={setEmail}
          />
          {errors.email ? (
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.email}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormControl.Label>Пароль</FormControl.Label>
          <Input
            placeholder="Введите ваш пароль..."
            value={password}
            onChangeText={setPassword}
            type="password"
          />
          {errors.password ? (
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.password}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <Button mt={4} onPress={click}>
          {isLogin ? 'Войти' : 'Регистрация'}
        </Button>
        <Text
          mt={4}
          textAlign="center"
          onPress={() => setIsLogin(!isLogin)}
          style={{ color: 'blue', textDecorationLine: 'underline' }}
        >
          {isLogin
            ? 'Нет аккаунта? Зарегистрируйтесь!'
            : 'Есть аккаунт? Войдите!'}
        </Text>
      </VStack>
    </ScrollView>
  )
})

export default Auth
