import React, { useContext, useEffect, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Modal,
  Spinner,
} from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { FaCheck } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { PROFILE_ROUTE } from '../utils/consts'
import { Context } from '../index'
import { fetchExchangeRate } from '../http/currencyAPI'
import { fetchProfile } from '../http/profileAPI'
import { truncate } from '../utils/truncate'

const Basket = observer(() => {
  const { basket, profile } = useContext(Context)
  const [usdRate, setUsdRate] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
    if (!checkProfileFields()) {
      setShowProfileModal(true)
    } else {
      setShowModal(true)
    }
  }

  const handleRemove = async (id) => {
    basket.removeDevice(id)
  }

  const handlePayment = () => {
    setIsLoading(true)
    setTimeout(async () => {
      try {
        await basket.handlePayment()
        setIsLoading(false)
        setPaymentSuccess(true)

        setTimeout(() => {
          basket.clearBasket()
          setShowModal(false)
        }, 5000)
      } catch (error) {
        console.error('Ошибка при завершении транзакции:', error)
        setIsLoading(false)
      }
    }, 2000)
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Оплата заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentSuccess ? (
            <div className="text-center">
              <FaCheck size={50} color="green" />
              <h4 className="mt-3">Оплата совершена!</h4>
              <p>С вами свяжутся по контактному номеру.</p>
            </div>
          ) : (
            <>
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
                  <strong>Адрес:</strong> {profile.profile?.address}
                </p>
                <p>
                  <strong>Телефон:</strong> {profile.profile?.phone}
                </p>
              </div>
              <Button
                variant="primary"
                className="w-100"
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  'Оплатить заказ'
                )}
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Заполните профиль</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Чтобы оформить заказ, внесите, пожалуйста, личные данные в профиле.
          </p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            variant="primary"
            onClick={() => {
              setShowProfileModal(false)
              history.push(PROFILE_ROUTE)
            }}
          >
            Перейти в личный кабинет
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
})

export default Basket
