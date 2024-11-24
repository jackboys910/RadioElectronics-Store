const Router = require('express')
const router = new Router()
const profileController = require('../controllers/profileController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, profileController.getProfile)
router.put('/', authMiddleware, profileController.updateProfile)

module.exports = router
