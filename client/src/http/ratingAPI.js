import { $authHost, $host } from './index'

export const rateDevice = async (deviceId, userId, rate) => {
  const { data } = await $authHost.post('api/rating', {
    deviceId,
    userId,
    rate,
  })
  return data
}

export const fetchDeviceRating = async (deviceId, userId) => {
  const { data } = await $authHost.get('api/rating', {
    params: { deviceId, userId },
  })
  return data
}

export const fetchAverageRating = async (deviceId) => {
  const { data } = await $host.get(`api/rating/average/${deviceId}`)
  return data.average
}
