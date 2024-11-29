import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  ListGroup,
} from 'react-bootstrap'
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
    <Container className="mt-4">
      <Row>
        <Col
          md={4}
          className="d-flex justify-content-center align-items-center"
          style={{
            minHeight: '400px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Image
            fluid
            rounded
            src={process.env.REACT_APP_API_URL + device.img}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'cover',
            }}
          />
        </Col>

        <Col md={8}>
          <div
            className="text-center p-3"
            style={{
              borderBottom: '1px solid #ddd',
              marginBottom: '20px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            <h2
              title={device.name}
              style={{ fontSize: '2rem', letterSpacing: '0.5px' }}
            >
              {truncate(device.name, 20)}
            </h2>
          </div>
          <div className="text-center mb-4">
            <h5
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              Средняя оценка:
            </h5>
            <div className="d-flex justify-content-center align-items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <MdStar
                  key={star}
                  size={36}
                  color={star <= averageRating ? 'gold' : 'gray'}
                />
              ))}
              <span
                style={{
                  marginLeft: '10px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}
              >
                ({averageRating.toFixed(2)})
              </span>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4} style={{ marginBottom: 40 }}>
          <Card
            className="p-4 text-center"
            style={{
              minHeight: '320px',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h4
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '20px',
              }}
            >
              Цена: {device.price} руб. (
              {usdRate ? (device.price * usdRate).toFixed(2) : '...'}$)
            </h4>
            {user.isAuth && (
              <>
                <div className="d-flex justify-content-center mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MdStar
                      key={star}
                      size={40}
                      color={star <= (hoverRating || rating) ? 'gold' : 'gray'}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRate(star)}
                    />
                  ))}
                </div>
                <Button
                  variant="outline-dark"
                  className="mt-4"
                  style={{ padding: '10px 20px', fontSize: '1.2rem' }}
                  onClick={handleAddToBasket}
                >
                  Добавить в корзину
                </Button>
              </>
            )}
          </Card>
        </Col>

        <Col md={8}>
          <Card
            className="p-4"
            style={{
              borderRadius: '12px',
              minHeight: '320px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: 40,
            }}
          >
            <h3
              className="text-center mb-4"
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#555',
              }}
            >
              Характеристики
            </h3>
            {device.info.length > 0 ? (
              <ListGroup variant="flush">
                {device.info.map((info, index) => (
                  <ListGroup.Item
                    key={info.id}
                    style={{
                      background: index % 2 === 0 ? '#f9f9f9' : '#fff',
                      padding: '15px',
                      borderRadius: '6px',
                      marginBottom: '10px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <strong>{info.title}:</strong> {info.description}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p
                className="text-center"
                style={{
                  color: '#999',
                  fontSize: '1.2rem',
                  fontStyle: 'italic',
                }}
              >
                Характеристики пока не добавлены.
              </p>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default DevicePage
