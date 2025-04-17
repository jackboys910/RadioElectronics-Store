import { $authHost } from './index'

export const fetchProfile = async () => {
  const { data } = await $authHost.get('/api/profile')
  return data
}

export const updateProfile = async (formData) => {
  const { data } = await $authHost.put('/api/profile', formData)
  return data
}

export const fetchUserOrders = async () => {
  const { data } = await $authHost.get('/api/profile/orders')
  return data
}

export const cancelOrder = async (transactionId) => {
  const { data } = await $authHost.put(
    `/api/profile/orders/${transactionId}/cancel`
  )
  return data
}
