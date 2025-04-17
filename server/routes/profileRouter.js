const Router = require('express')
const router = new Router()
const profileController = require('../controllers/profileController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, profileController.getProfile)
router.put('/', authMiddleware, profileController.updateProfile)
router.get('/orders', authMiddleware, profileController.getUserOrders)
router.put(
  '/orders/:transactionId/cancel',
  authMiddleware,
  profileController.cancelOrder
)
router.get('/:id', authMiddleware, profileController.getOrderDetails)

module.exports = router
