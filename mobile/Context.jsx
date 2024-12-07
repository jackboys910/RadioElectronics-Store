import React, { createContext } from 'react'
import UserStore from './store/UserStore'
import DeviceStore from './store/DeviceStore'
import BasketStore from './store/BasketStore'
import ProfileStore from './store/ProfileStore'

// Создаем контекст
export const Context = createContext({
  user: new UserStore(),
  device: new DeviceStore(),
  basket: new BasketStore(),
  profile: new ProfileStore(),
})

// Провайдер для обертки приложения
export const ContextProvider = ({ children }) => {
  const stores = {
    user: new UserStore(),
    device: new DeviceStore(),
    basket: new BasketStore(),
    profile: new ProfileStore(),
  }

  return <Context.Provider value={stores}>{children}</Context.Provider>
}
