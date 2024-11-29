const { BasketDevice, Basket, Device } = require('../models/models')
const ApiError = require('../error/ApiError')

class BasketController {
  async addDevice(req, res, next) {
    try {
      const userId = req.user.id
      const { deviceId } = req.body
      if (!deviceId) {
        return next(ApiError.badRequest('Не указан ID устройства'))
      }

      const basket = await Basket.findOne({ where: { userId } })
      if (!basket) {
        return next(ApiError.internal('Корзина пользователя не найдена'))
      }

      const basketDevice = await BasketDevice.create({
        basketId: basket.id,
        deviceId,
      })

      const device = await Device.findOne({ where: { id: deviceId } })

      return res.json({ ...basketDevice.dataValues, device })
    } catch (e) {
      next(ApiError.internal(e.message))
    }
  }

  async getBasket(req, res, next) {
    try {
      const userId = req.user.id
      const basket = await Basket.findOne({
        where: { userId },
        include: [{ model: BasketDevice, include: [Device] }],
      })

      if (!basket) {
        return next(ApiError.internal('Корзина пользователя не найдена'))
      }

      return res.json(basket)
    } catch (e) {
      next(ApiError.internal(e.message))
    }
  }

  async removeDevice(req, res, next) {
    try {
      const userId = req.user.id
      const { id } = req.params

      const basket = await Basket.findOne({ where: { userId } })
      if (!basket) {
        return next(ApiError.internal('Корзина пользователя не найдена'))
      }

      const basketDevice = await BasketDevice.findOne({
        where: { id, basketId: basket.id },
      })

      if (!basketDevice) {
        return next(ApiError.badRequest('Товар в корзине не найден'))
      }

      await basketDevice.destroy()

      return res.json({ message: 'Товар удалён из корзины' })
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }

  async clearBasket(req, res, next) {
    try {
      const userId = req.user.id

      const basket = await Basket.findOne({ where: { userId } })
      if (!basket) {
        return next(ApiError.internal('Корзина пользователя не найдена'))
      }

      await BasketDevice.destroy({ where: { basketId: basket.id } })

      return res.json({ message: 'Корзина успешно очищена' })
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }
}

module.exports = new BasketController()
