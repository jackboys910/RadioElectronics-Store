import jwt_decode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { $authHost, $host } from './index'

export const registration = async (email, password, basketStore) => {
  const { data } = await $host.post('api/user/registration', {
    email,
    password,
  })
  await AsyncStorage.setItem('token', data.token)

  if (basketStore) {
    await basketStore.fetchBasketDevices()
  }

  return jwt_decode(data.token)
}

export const login = async (email, password, basketStore) => {
  const { data } = await $host.post('api/user/login', { email, password })
  await AsyncStorage.setItem('token', data.token)

  if (basketStore) {
    await basketStore.fetchBasketDevices()
  }

  return jwt_decode(data.token)
}

export const check = async () => {
  const { data } = await $authHost.get('api/user/auth')
  await AsyncStorage.setItem('token', data.token)
  return jwt_decode(data.token)
}
