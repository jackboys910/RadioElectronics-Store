import React, { useState } from 'react'
import { Button, Spinner, Row, Col } from 'react-bootstrap'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createPaymentIntent } from '../http/paymentAPI'

const CheckoutForm = ({ basket, onSuccess, usdRate }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const amountInCents = Math.round(basket.totalPrice * usdRate * 100)
      const { clientSecret } = await createPaymentIntent(amountInCents)

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (paymentResult.error) {
        setError(paymentResult.error.message)
      } else if (paymentResult.paymentIntent.status === 'succeeded') {
        await basket.handlePayment()
        onSuccess()
      }
    } catch (error) {
      console.error('Ошибка при обработке платежа:', error)
      setError('Произошла ошибка. Попробуйте еще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 rounded shadow-lg bg-light">
      <Row className="mb-3">
        <Col>
          <h5>Сумма к оплате:</h5>
        </Col>
        <Col>
          <h5>
            {basket.totalPrice} руб. (
            {usdRate ? (basket.totalPrice * usdRate).toFixed(2) : '...'}$)
          </h5>
        </Col>
      </Row>
      <CardElement
        className="mb-3 p-2 border rounded"
        options={{ disableLink: true, hidePostalCode: true }}
      />
      {error && <div className="text-danger mb-3">{error}</div>}
      <Button
        type="submit"
        variant="primary"
        className="w-100"
        disabled={!stripe || loading}
      >
        {loading ? <Spinner animation="border" size="sm" /> : 'Оплатить'}
      </Button>
    </form>
  )
}

export default CheckoutForm
