import { login } from '../http/userAPI'

export const handleLogin = async (email, password, userStore, basketStore) => {
  try {
    const decodedToken = await login(email, password, basketStore)
    userStore.setUser(decodedToken)
    userStore.setIsAuth(true)
  } catch (error) {
    throw error
  }
}
