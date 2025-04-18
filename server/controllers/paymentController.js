const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const ApiError = require('../error/ApiError')

class PaymentController {
  async createPaymentIntent(req, res, next) {
    try {
      const { amount } = req.body

      if (!amount || amount <= 0) {
        return next(ApiError.badRequest('Некорректная сумма платежа'))
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
      })

      return res.json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
      next(ApiError.internal(error.message))
    }
  }
}

module.exports = new PaymentController()
