import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import UserStore from './store/UserStore'
import DeviceStore from './store/DeviceStore'
import BasketStore from './store/BasketStore'
import ProfileStore from './store/ProfileStore'
import TransactionStore from './store/TransactionStore'

export const Context = createContext(null)

const yandexMapsKey = process.env.REACT_APP_YANDEX_MAPS_KEY
const script = document.createElement('script')
script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${yandexMapsKey}`
script.async = true
document.head.appendChild(script)

ReactDOM.render(
  <Context.Provider
    value={{
      user: new UserStore(),
      device: new DeviceStore(),
      basket: new BasketStore(),
      profile: new ProfileStore(),
      transaction: new TransactionStore(),
    }}
  >
    <App />
  </Context.Provider>,
  document.getElementById('root')
)
