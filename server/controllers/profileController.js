const { Profile, Transaction, Device } = require('../models/models')
const ApiError = require('../error/ApiError')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const sharp = require('sharp')

class ProfileController {
  async getProfile(req, res, next) {
    const { id } = req.user
    const profile = await Profile.findOne({ where: { userId: id } })

    if (!profile) {
      return next(ApiError.notFound('Профиль не найден'))
    }

    return res.json(profile)
  }

  async updateProfile(req, res, next) {
    const { id } = req.user
    const { firstName, lastName, phone, address } = req.body

    const profile = await Profile.findOne({ where: { userId: id } })
    if (!profile) {
      return next(ApiError.notFound('Профиль не найден'))
    }

    const imagesDir = path.resolve(__dirname, '..', 'static', 'images')
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
    }

    let fileName = profile.photo
    if (req.files && req.files.photo) {
      const { photo } = req.files

      const allowedFormats = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/gif',
      ]
      if (!allowedFormats.includes(photo.mimetype)) {
        return next(
          ApiError.badRequest(
            'Можно загружать только изображения форматов png, jpg, jpeg, gif.'
          )
        )
      }

      fileName = uuidv4() + '.jpg'
      const tempFilePath = path.resolve(imagesDir, 'temp-' + fileName)
      const finalFilePath = path.resolve(imagesDir, fileName)

      try {
        await photo.mv(tempFilePath)

        await sharp(tempFilePath)
          .resize(225, 225)
          .toFormat('jpeg')
          .toFile(finalFilePath)

        fs.unlinkSync(tempFilePath)

        if (profile.photo !== 'user.png') {
          const oldPath = path.resolve(imagesDir, profile.photo)
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath)
          }
        }
      } catch (err) {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath)
        }
        return next(ApiError.internal('Ошибка обработки изображения.'))
      }
    }

    if (req.body.photo === '') {
      if (profile.photo !== 'user.png') {
        const oldPath = path.resolve(imagesDir, profile.photo)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
      fileName = 'user.png'
    }

    await profile.update({
      firstName,
      lastName,
      phone,
      address,
      photo: fileName,
    })
    return res.json(profile)
  }

  async getUserOrders(req, res, next) {
    try {
      const userId = req.user.id
      const transactions = await Transaction.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      })

      return res.json(transactions)
    } catch (err) {
      next(ApiError.internal('Ошибка при загрузке заказов.'))
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const userId = req.user.id
      const { transactionId } = req.params

      const transaction = await Transaction.findOne({
        where: { id: transactionId, userId },
      })

      if (!transaction) {
        return next(ApiError.badRequest('Заказ не найден'))
      }

      if (transaction.isCanceled) {
        return next(ApiError.badRequest('Заказ уже отменен'))
      }

      await transaction.update({
        isCanceled: true,
        canceledAt: new Date(),
      })

      return res.json({ message: 'Заказ успешно отменен.', transaction })
    } catch (err) {
      next(ApiError.internal('Ошибка при отмене заказа.'))
    }
  }

  async getOrderDetails(req, res, next) {
    try {
      const { id } = req.params

      const order = await Transaction.findOne({
        where: { id },
      })

      if (!order) {
        return res.status(404).json({ message: 'Заказ не найден' })
      }

      const devicesWithImages = await Promise.all(
        order.devices.map(async (device) => {
          const fullDevice = await Device.findOne({
            where: { id: device.deviceId },
            attributes: ['id', 'name', 'price', 'img'],
          })

          return { ...device, img: fullDevice?.img || null }
        })
      )

      return res.json({ ...order.dataValues, devices: devicesWithImages })
    } catch (error) {
      next(ApiError.internal('Ошибка при загрузке деталей заказа.'))
    }
  }
}

module.exports = new ProfileController()
