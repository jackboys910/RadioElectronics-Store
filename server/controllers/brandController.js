const { Brand } = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController {
  async create(req, res, next) {
    try {
      const { name } = req.body

      const existingBrand = await Brand.findOne({ where: { name } })
      if (existingBrand) {
        return next(ApiError.badRequest('Бренд с таким именем уже существует'))
      }

      const brand = await Brand.create({ name })
      return res.json(brand)
    } catch (error) {
      return next(ApiError.badRequest('Бренд с таким именем уже существует'))
    }
  }

  async getAll(req, res) {
    const brands = await Brand.findAll()
    return res.json(brands)
  }

  async update(req, res, next) {
    const { id } = req.params
    const { name } = req.body
    const brand = await Brand.update({ name }, { where: { id } })
    return res.json(brand)
  }

  async delete(req, res, next) {
    const { id } = req.params
    await Brand.destroy({ where: { id } })
    return res.json({ message: 'Бренд удален' })
  }
}

module.exports = new BrandController()
