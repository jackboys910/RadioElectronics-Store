import React, { useState, useEffect } from 'react'
import { Card, Col } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'
import star from '../assets/star.png'
import { useHistory } from 'react-router-dom'
import { DEVICE_ROUTE } from '../utils/consts'
import { fetchAverageRating } from '../http/ratingAPI'
import { truncate } from '../utils/truncate'

const DeviceItem = ({ device }) => {
  const history = useHistory()
  const [averageRating, setAverageRating] = useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // useEffect(() => {
  //   let isMouted = true
  //   fetchAverageRating(device.id).then((rating) => {
  //     if (isMouted) {
  //       setAverageRating(rating)
  //     }
  //   })
  // }, [device.id])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const signal = controller.signal

    fetchAverageRating(device.id, { signal })
      .then((rating) => {
        if (isMounted) {
          setAverageRating(rating)
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Запрос был отменен')
        } else {
          console.error('Ошибка при загрузке рейтинга:', error)
        }
      })

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [device.id])

  const colStyle = {
    marginRight: windowWidth >= 390 && windowWidth <= 992 ? 30 : 0,
  }

  return (
    <Col
      md={3}
      className={'mt-3'}
      onClick={() => history.push(DEVICE_ROUTE + '/' + device.id)}
      style={colStyle}
    >
      <Card style={{ width: 150, cursor: 'pointer' }} border={'light'}>
        <Image
          width={150}
          height={150}
          src={process.env.REACT_APP_API_URL + device.img}
        />
        <div className="text-black-50 mt-1 d-flex justify-content-end align-items-center">
          {/* <div>Samsung...</div> */}
          <div className="d-flex align-items-center">
            <div>{averageRating.toFixed(1)}</div>
            <Image width={18} height={18} src={star} />
          </div>
        </div>
        <div>{truncate(device.name, 18)}</div>
      </Card>
    </Col>
  )
}

export default DeviceItem
