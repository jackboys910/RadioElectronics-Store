import axios from 'axios'

export const fetchExchangeRate = async () => {
  const API_URL = 'http://apilayer.net/api/live'
  const ACCESS_KEY = process.env.REACT_APP_CURRENCY_ACCESS_KEY
  const CURRENCIES = 'USD'
  const SOURCE = 'RUB'
  const FORMAT = 1

  try {
    const response = await axios.get(API_URL, {
      params: {
        access_key: ACCESS_KEY,
        currencies: CURRENCIES,
        source: SOURCE,
        format: FORMAT,
      },
    })

    const data = response.data

    if (data.success) {
      const usdRate = data.quotes['RUBUSD']
      return usdRate
    } else {
      console.error('Ошибка при получении курса валют:', data.error.info)
      return null
    }
  } catch (error) {
    console.error('Ошибка запроса:', error)
    return null
  }
}
