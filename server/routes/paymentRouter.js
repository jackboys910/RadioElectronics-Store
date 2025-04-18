const Router = require('express')
const router = new Router()
const paymentController = require('../controllers/paymentController')
const authMiddleware = require('../middleware/authMiddleware')

router.post(
  '/create-payment-intent',
  authMiddleware,
  paymentController.createPaymentIntent
)

module.exports = router
