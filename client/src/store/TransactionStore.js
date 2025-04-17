import { makeAutoObservable, runInAction } from 'mobx'
import { fetchUserOrders, cancelOrder } from '../http/profileAPI'

export default class TransactionStore {
  constructor() {
    this._orders = []
    this._loading = false
    this._error = null
    makeAutoObservable(this)
  }

  setOrders(orders) {
    runInAction(() => {
      this._orders = orders
    })
  }

  setLoading(loading) {
    runInAction(() => {
      this._loading = loading
    })
  }

  setError(error) {
    runInAction(() => {
      this._error = error
    })
  }

  async fetchOrders() {
    this.setLoading(true)
    try {
      const data = await fetchUserOrders()
      this.setOrders(data)
      this.setError(null)
    } catch (error) {
      this.setError('Ошибка загрузки заказов. Попробуйте позже.')
      console.error(error)
    } finally {
      this.setLoading(false)
    }
  }

  async cancelOrderById(orderId) {
    try {
      await cancelOrder(orderId)
      runInAction(() => {
        this._orders = this._orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                isCanceled: true,
                canceledAt: new Date().toISOString(),
              }
            : order
        )
      })
    } catch (error) {
      console.error('Ошибка отмены заказа:', error)
    }
  }

  get orders() {
    return this._orders
  }

  get loading() {
    return this._loading
  }

  get error() {
    return this._error
  }
}
