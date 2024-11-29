import { $authHost } from './index'

export const addToBasket = async (deviceId) => {
  const { data } = await $authHost.post('api/basket/add', { deviceId })
  return data
}

export const fetchBasket = async () => {
  const { data } = await $authHost.get('api/basket')
  return data
}

export const removeFromBasket = async (id) => {
  const { data } = await $authHost.delete(`api/basket/${id}`)
  return data
}

export const clearBasket = async () => {
  const { data } = await $authHost.delete('api/basket/clear')
  return data
}
