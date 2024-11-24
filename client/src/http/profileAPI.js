import { $authHost } from './index'

export const fetchProfile = async () => {
  const { data } = await $authHost.get('/api/profile')
  return data
}

export const updateProfile = async (formData) => {
  const { data } = await $authHost.put('/api/profile', formData)
  return data
}
