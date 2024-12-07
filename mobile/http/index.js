import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { REACT_APP_API_URL } from '@env'

const $host = axios.create({
  baseURL: REACT_APP_API_URL.slice(0, -1),
})

const $authHost = axios.create({
  baseURL: REACT_APP_API_URL.slice(0, -1),
})

const authInterceptor = async (config) => {
  config.headers.authorization = `Bearer ${await AsyncStorage.getItem('token')}`
  return config
}

$authHost.interceptors.request.use(authInterceptor)

export { $host, $authHost }
