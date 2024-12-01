const { Type } = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
  async create(req, res, next) {
    try {
      const { name } = req.body
      const existingType = await Type.findOne({ where: { name } })
      if (existingType) {
        return next(ApiError.badRequest('Тип с таким именем уже существует'))
      }

      const type = await Type.create({ name })
      return res.json(type)
    } catch (error) {
      return next(ApiError.badRequest('Тип с таким именем уже существует'))
    }
  }

  async getAll(req, res) {
    const types = await Type.findAll()
    return res.json(types)
  }

  async update(req, res, next) {
    try {
      const { id } = req.params
      const { name } = req.body
      const [updatedRowsCount] = await Type.update({ name }, { where: { id } })
      if (!updatedRowsCount) {
        return next(ApiError.badRequest('Тип не найден'))
      }
      return res.json({ message: 'Тип обновлен', id })
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const deletedRowsCount = await Type.destroy({ where: { id } })
      if (!deletedRowsCount) {
        return next(ApiError.badRequest('Тип не найден'))
      }
      return res.json({ message: 'Тип удален', id })
    } catch (e) {
      next(ApiError.internal(e.message))
    }
  }
}

module.exports = new TypeController()
