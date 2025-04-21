import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Image, Button, Modal } from 'react-bootstrap'
import { FaCheck } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { PROFILE_ROUTE } from '../utils/consts'
import { Context } from '../index'
import { fetchExchangeRate } from '../http/currencyAPI'
import { fetchProfile } from '../http/profileAPI'
import { truncate } from '../utils/truncate'
import CheckoutForm from '../components/CheckoutForm'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const Basket = observer(() => {
  const { basket, profile } = useContext(Context)
  const [usdRate, setUsdRate] = useState(0)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const history = useHistory()

  useEffect(() => {
    basket.fetchBasketDevices()
    fetchExchangeRate().then((rate) => setUsdRate(rate))

    profile.setLoading(true)
    fetchProfile()
      .then((data) => {
        profile.setProfile(data)
        profile.setError(null)
      })
      .catch(() => {
        profile.setError('Ошибка загрузки профиля. Попробуйте позже.')
      })
      .finally(() => {
        profile.setLoading(false)
      })
  }, [basket, profile])

  const checkProfileFields = () => {
    const { firstName, lastName, phone, address } = profile.profile || {}
    return firstName && lastName && phone && address
  }

  const handleOrder = () => {
    setShowProfileModal(true)
  }

  const handleRemove = async (id) => {
    basket.removeDevice(id)
  }

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    setTimeout(() => {
      setPaymentSuccess(false)
      setShowPaymentModal(false)
      setShowProfileModal(false)
    }, 5000)
  }

  return (
    <Container className="mt-3">
      <h1>Корзина</h1>
      {basket.basketDevices.length === 0 ? (
        <h3>Ваша корзина пуста</h3>
      ) : (
        <>
          {basket.basketDevices.map(({ id, device }) =>
            device ? (
              <Row key={id} className="d-flex align-items-center mb-3">
                <Col md={2}>
                  <Image
                    width={100}
                    height={100}
                    src={
                      device?.img
                        ? process.env.REACT_APP_API_URL + device.img
                        : ''
                    }
                  />
                </Col>
                <Col title={device.name} md={4}>
                  {truncate(device.name, 25)}
                </Col>
                <Col md={2}>
                  {device.price} руб. (
                  {usdRate ? (device.price * usdRate).toFixed(2) : '...'}$)
                </Col>
                <Col md={2}>
                  <Button variant="danger" onClick={() => handleRemove(id)}>
                    Удалить
                  </Button>
                </Col>
              </Row>
            ) : null
          )}
          <Row className="mt-4">
            <Col md={6}>
              <h4>
                Итоговая сумма: {basket.totalPrice} руб. (
                {usdRate ? (basket.totalPrice * usdRate).toFixed(2) : '...'}$)
              </h4>
            </Col>
            <Col
              style={{ marginTop: 70 }}
              md={{ span: 6 }}
              className="d-flex justify-content-end"
            >
              <Button
                variant="danger"
                className="me-3"
                onClick={() => basket.clearBasket()}
                style={{ marginRight: 10 }}
              >
                Очистить корзину
              </Button>
              <Button variant="success" onClick={handleOrder}>
                Оформить заказ
              </Button>
            </Col>
          </Row>
        </>
      )}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Оформление заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checkProfileFields() ? (
            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '15px',
              }}
            >
              <p>
                <strong>Имя:</strong> {profile.profile?.firstName}
              </p>
              <p>
                <strong>Фамилия:</strong> {profile.profile?.lastName}
              </p>
              <p>
                <strong>Адрес:</strong> {truncate(profile.profile?.address, 40)}
              </p>
              <p>
                <strong>Телефон:</strong> {profile.profile?.phone}
              </p>
            </div>
          ) : (
            <p>
              Чтобы оформить заказ, внесите, пожалуйста, личные данные в
              профиле.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {checkProfileFields() ? (
            <Button
              variant="success"
              onClick={() => {
                setShowProfileModal(false)
                setShowPaymentModal(true)
              }}
            >
              Оплатить заказ
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                setShowProfileModal(false)
                history.push(PROFILE_ROUTE)
              }}
            >
              Перейти в личный кабинет
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {paymentSuccess ? 'Оплата завершена' : 'Оплата заказа'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentSuccess ? (
            <div className="text-center">
              <FaCheck size={50} color="green" />
              <h4 className="mt-3">Оплата успешно завершена!</h4>
              <p>С вами свяжутся по контактному номеру.</p>
            </div>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                basket={basket}
                onSuccess={handlePaymentSuccess}
                usdRate={usdRate}
              />
            </Elements>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  )
})

export default Basket
