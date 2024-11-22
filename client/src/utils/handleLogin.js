import { login } from '../http/userAPI'

export const handleLogin = async (email, password, userStore) => {
  try {
    const decodedToken = await login(email, password)
    userStore.setUser(decodedToken)
    userStore.setIsAuth(true)
  } catch (error) {
    console.error('Ошибка входа:', error)
    throw error
  }
}
