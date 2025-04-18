import { $authHost } from './index'

export const createPaymentIntent = async (amount) => {
  const { data } = await $authHost.post('api/payment/create-payment-intent', {
    amount,
  })
  return data
}
