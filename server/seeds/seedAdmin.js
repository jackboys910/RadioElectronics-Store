require('dotenv').config()
const sequelize = require('../db')
const bcrypt = require('bcrypt')
const { User, Basket, Profile } = require('../models/models')

const createAdmin = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')

    const adminEmail = 'admin@gmail.com'
    const hashPassword = await bcrypt.hash('admin', 5)

    const admin = await User.findOne({ where: { email: adminEmail } })
    if (!admin) {
      await User.create({
        email: adminEmail,
        password: hashPassword,
        role: 'ADMIN',
      })
      console.log('Admin user has been created successfully.')
    } else {
      console.log('Admin user already exists.')
    }

    const existingAdminProfile = await Profile.findOne({
      where: { userId: admin.id },
    })
    if (!existingAdminProfile) {
      await Profile.create({
        userId: admin.id,
        firstName: 'Admin',
        lastName: 'Admin',
        phone: '',
        address: '',
        photo: 'user.png',
      })
      console.log('Admin profile has been created successfully.')
    } else {
      console.log('Admin profile already exists.')
    }

    const existingAdminBasket = await Basket.findOne({
      where: { userId: admin.id },
    })
    if (!existingAdminBasket) {
      await Basket.create({ userId: admin.id })
      console.log('Admin basket has been created successfully.')
    } else {
      console.log('Admin basket already exists.')
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

module.exports = createAdmin
