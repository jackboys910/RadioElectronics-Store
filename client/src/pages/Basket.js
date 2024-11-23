import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Image, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { Context } from '../index'
import { fetchExchangeRate } from '../http/currencyAPI'

const Basket = observer(() => {
  const { basket } = useContext(Context)
  const [usdRate, setUsdRate] = useState(0)

  useEffect(() => {
    basket.fetchBasketDevices()
    fetchExchangeRate().then((rate) => setUsdRate(rate))
  }, [])

  const handleRemove = async (id) => {
    basket.removeDevice(id)
  }

  return (
    <Container className="mt-3">
      <h1>Корзина</h1>
      {basket.basketDevices.length === 0 ? (
        <h3>Ваша корзина пуста</h3>
      ) : (
        <>
          {basket.basketDevices.map(({ id, device }) => (
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
              <Col md={4}>{device.name}</Col>
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
          ))}
          <Row className="mt-4">
            <Col md={6}>
              <h4>
                Итоговая сумма: {basket.totalPrice} руб. (
                {usdRate ? (basket.totalPrice * usdRate).toFixed(2) : '...'}$)
              </h4>
            </Col>
            <Col md={{ span: 3, offset: 9 }}>
              <Button variant="success" className="w-100">
                Оформить заказ
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
})

export default Basket
