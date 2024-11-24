const { Profile } = require('../models/models')
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
      fileName = uuidv4() + '.jpg'
      const tempFilePath = path.resolve(imagesDir, 'temp-' + fileName)
      const finalFilePath = path.resolve(imagesDir, fileName)

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
}

module.exports = new ProfileController()
