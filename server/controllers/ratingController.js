const { Rating } = require('../models/models')

class RatingController {
  async setRating(req, res) {
    const { deviceId, userId, rate } = req.body
    const existingRating = await Rating.findOne({ where: { deviceId, userId } })

    if (existingRating) {
      existingRating.rate = rate
      await existingRating.save()
      return res.json(existingRating)
    }

    const newRating = await Rating.create({ deviceId, userId, rate })
    return res.json(newRating)
  }

  async getRating(req, res) {
    const { deviceId, userId } = req.query
    const rating = await Rating.findOne({ where: { deviceId, userId } })
    return res.json(rating)
  }

  async getAverageRating(req, res) {
    const { deviceId } = req.params
    const ratings = await Rating.findAll({ where: { deviceId } })
    const average =
      ratings.reduce((sum, r) => sum + r.rate, 0) / ratings.length || 0
    return res.json({ average })
  }
}

module.exports = new RatingController()
