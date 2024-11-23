import { makeAutoObservable } from 'mobx'
import { fetchBasket, addToBasket, removeFromBasket } from '../http/basketAPI'

export default class BasketStore {
  constructor() {
    this._basketDevices = []
    this._totalPrice = 0
    makeAutoObservable(this)
  }

  setBasketDevices(basketDevices) {
    this._basketDevices = basketDevices
    this._calculateTotalPrice()
  }

  addDeviceToBasket(basketDevice) {
    const device = basketDevice.device || basketDevice
    if (!device || device.price === undefined || device.price === null) {
      console.error('Некорректные данные устройства:', basketDevice)
      return
    }
    if (device.price < 0) {
      console.error(
        'Цена устройства не может быть отрицательной:',
        basketDevice
      )
      return
    }
    this._basketDevices.push(basketDevice)
    this._calculateTotalPrice()
  }

  removeDeviceFromBasket(id) {
    this._basketDevices = this._basketDevices.filter((item) => item.id !== id)
    this._calculateTotalPrice()
  }

  async fetchBasketDevices() {
    try {
      const data = await fetchBasket()
      this.setBasketDevices(data.basket_devices || [])
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error)
    }
  }

  async addDevice(deviceId) {
    try {
      const basketDevice = await addToBasket(deviceId)
      if (!basketDevice.device) {
        console.error(
          'Ответ API не содержит информацию об устройстве:',
          basketDevice
        )
        return
      }
      this.addDeviceToBasket(basketDevice)
    } catch (error) {
      console.error('Ошибка при добавлении устройства в корзину:', error)
    }
  }

  async removeDevice(id) {
    try {
      await removeFromBasket(id)
      this.removeDeviceFromBasket(id)
    } catch (error) {
      console.error('Ошибка при удалении устройства из корзины:', error)
    }
  }

  _calculateTotalPrice() {
    this._totalPrice = this._basketDevices.reduce((sum, item) => {
      const device = item.device || item
      return sum + (device.price || 0)
    }, 0)
  }

  get basketDevices() {
    return this._basketDevices
  }

  get totalPrice() {
    return this._totalPrice
  }
}
