import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap'
import bigStar from '../assets/bigStar.png'
import { useParams } from 'react-router-dom'
import { fetchOneDevice } from '../http/deviceAPI'
import { Context } from '../index'
import { MdStar } from 'react-icons/md'
import {
  rateDevice,
  fetchDeviceRating,
  fetchAverageRating,
} from '../http/ratingAPI'
import { fetchExchangeRate } from '../http/currencyAPI'
import { truncate } from '../utils/truncate'

const DevicePage = () => {
  const [device, setDevice] = useState({ info: [] })
  const [usdRate, setUsdRate] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const { id } = useParams()
  const { basket, user } = useContext(Context)

  useEffect(() => {
    fetchOneDevice(id).then((data) => setDevice(data))

    fetchAverageRating(id).then((rating) => setAverageRating(rating))

    if (user.isAuth) {
      fetchDeviceRating(id, user.user.id).then((data) => {
        if (data) {
          setRating(data.rate)
        }
      })
    }
  }, [id, user.isAuth, user.user.id])

  useEffect(() => {
    fetchExchangeRate().then((rate) => setUsdRate(rate))
  }, [id])

  const handleAddToBasket = async () => {
    basket.addDevice(device.id)
  }

  const handleRate = async (rate) => {
    if (!user.isAuth) {
      alert('Вы должны войти в систему, чтобы оставить оценку.')
      return
    }

    try {
      await rateDevice(id, user.user.id, rate)
      setRating(rate)
      fetchAverageRating(id).then((rating) => setAverageRating(rating))
    } catch (error) {
      console.error('Ошибка при отправке рейтинга:', error)
    }
  }

  return (
    <Container className="mt-3">
      <Row>
        <Col md={4}>
          <Image
            width={300}
            height={300}
            src={process.env.REACT_APP_API_URL + device.img}
          />
        </Col>
        <Col md={4}>
          <Row className="d-flex flex-column align-items-center">
            <h2 title={device.name}>{truncate(device.name, 20)}</h2>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                background: `url(${bigStar}) no-repeat center center`,
                width: 240,
                height: 240,
                backgroundSize: 'cover',
                fontSize: 50,
              }}
            >
              {averageRating.toFixed(2)}
            </div>
          </Row>
        </Col>
        <Col md={4}>
          <Card
            className="d-flex flex-column align-items-center justify-content-around"
            style={{
              width: 300,
              height: 300,
              fontSize: 32,
              border: '5px solid lightgray',
            }}
          >
            <h3>
              От: {device.price} руб. (
              {usdRate ? (device.price * usdRate).toFixed(2) : '...'}$)
            </h3>
            {user.isAuth && (
              <>
                <div className="d-flex mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MdStar
                      key={star}
                      size={32}
                      color={star <= (hoverRating || rating) ? 'gold' : 'gray'}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRate(star)}
                    />
                  ))}
                </div>
                <Button variant={'outline-dark'} onClick={handleAddToBasket}>
                  Добавить в корзину
                </Button>
              </>
            )}
          </Card>
        </Col>
      </Row>
      <Row className="d-flex flex-column m-3">
        <h1>Характеристики</h1>
        {device.info.map((info, index) => (
          <Row
            key={info.id}
            style={{
              background: index % 2 === 0 ? 'lightgray' : 'transparent',
              padding: 10,
            }}
          >
            {info.title}: {info.description}
          </Row>
        ))}
      </Row>
    </Container>
  )
}

export default DevicePage
