require('dotenv').config()
const sequelize = require('../db')
const bcrypt = require('bcrypt')
const { User, Basket } = require('../models/models')

const createAdmin = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')

    const adminEmail = 'admin@gmail.com'
    const existingAdmin = await User.findOne({ where: { email: adminEmail } })
    if (existingAdmin) {
      console.log('Admin already exists.')
      return
    }

    const hashPassword = await bcrypt.hash('toChange', 5)
    const admin = await User.create({
      email: adminEmail,
      password: hashPassword,
      role: 'ADMIN',
    })

    await Basket.create({ userId: admin.id })

    console.log('Admin user has been created successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

module.exports = createAdmin
