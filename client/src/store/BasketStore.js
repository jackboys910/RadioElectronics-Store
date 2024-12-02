import { makeAutoObservable, runInAction } from 'mobx'
import {
  fetchBasket,
  addToBasket,
  removeFromBasket,
  clearBasket,
  purchaseBasket,
} from '../http/basketAPI'

export default class BasketStore {
  constructor() {
    this._basketDevices = []
    this._totalPrice = 0
    makeAutoObservable(this)
  }

  setBasketDevices(basketDevices) {
    runInAction(() => {
      this._basketDevices = basketDevices
      this._calculateTotalPrice()
    })
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
    runInAction(() => {
      this._basketDevices.push(basketDevice)
      this._calculateTotalPrice()
    })
  }

  removeDeviceFromBasket(id) {
    runInAction(() => {
      this._basketDevices = this._basketDevices.filter((item) => item.id !== id)
      this._calculateTotalPrice()
    })
  }

  async fetchBasketDevices() {
    try {
      const data = await fetchBasket()

      const validBasketDevices = (data.basket_devices || []).filter(
        (item) => item.device !== null
      )

      runInAction(() => {
        this.setBasketDevices(validBasketDevices)
      })
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
      runInAction(() => {
        this.addDeviceToBasket(basketDevice)
      })
    } catch (error) {
      console.error('Ошибка при добавлении устройства в корзину:', error)
    }
  }

  async removeDevice(id) {
    try {
      await removeFromBasket(id)
      runInAction(() => {
        this.removeDeviceFromBasket(id)
      })
    } catch (error) {
      console.error('Ошибка при удалении устройства из корзины:', error)
    }
  }

  async clearBasket() {
    try {
      await clearBasket()
      runInAction(() => {
        this._basketDevices = []
        this._totalPrice = 0
      })
    } catch (error) {
      console.error('Ошибка при очистке корзины:', error)
    }
  }

  async handlePayment() {
    try {
      const result = await purchaseBasket()
      runInAction(() => {
        setTimeout(() => {
          this.clearBasket()
        }, 5000)
      })
      return result
    } catch (error) {
      console.error('Ошибка при завершении транзакции:', error)
    }
  }

  _calculateTotalPrice() {
    runInAction(() => {
      this._totalPrice = this._basketDevices.reduce((sum, item) => {
        const device = item.device || item
        return sum + (device.price || 0)
      }, 0)
    })
  }

  get basketDevices() {
    return this._basketDevices
  }

  get totalPrice() {
    return this._totalPrice
  }
}
