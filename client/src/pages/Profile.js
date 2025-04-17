import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../index'
import {
  Button,
  Container,
  Form,
  Image,
  Spinner,
  Tab,
  Tabs,
  Card,
  Row,
  Col,
} from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import {
  fetchProfile,
  updateProfile,
  fetchOrderDetails,
} from '../http/profileAPI'
import { fetchExchangeRate } from '../http/currencyAPI'
import { profileValidationSchema } from '../utils/validation/profileValidation'
import ConfirmationModal from '../components/modals/ConfirmationModal'
import OrderDetailsModal from '../components/modals/OrderDetailsModal'

const Profile = observer(() => {
  const { profile, user, transaction } = useContext(Context)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    photo: null,
  })
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTeb] = useState('profile')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false)
  const [usdRate, setUsdRate] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      profile.setLoading(true)
      try {
        const data = await fetchProfile()
        if (isMounted) {
          profile.setProfile(data)
          setForm({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: data.phone || '',
            address: data.address || '',
            photo: null,
          })
          profile.setError(null)
        }
      } catch (error) {
        if (isMounted) {
          profile.setError('Ошибка загрузки профиля. Попробуйте позже.')
        }
      } finally {
        if (isMounted) {
          profile.setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [profile])

  useEffect(() => {
    if (activeTab === 'orders') {
      transaction.fetchOrders()
    }
  }, [activeTab, transaction])

  useEffect(() => {
    fetchExchangeRate().then((rate) => setUsdRate(rate))
  }, [])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: false })
  }

  const validateForm = async () => {
    try {
      await profileValidationSchema.validate(form, { abortEarly: false })
      setErrors({})
      return true
    } catch (err) {
      const newErrors = {}
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message
      })
      setErrors(newErrors)
      return false
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    setForm({ ...form, photo: file })

    if (file) {
      try {
        await profileValidationSchema.validateAt('photo', { photo: file })
        setErrors({ ...errors, photo: null })
      } catch (error) {
        setErrors({ ...errors, photo: error.message })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValid = await validateForm()
    if (!isValid) {
      return
    }

    if (errors.photo) {
      return
    }

    const formData = new FormData()
    for (const key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key])
      }
    }

    try {
      const updatedProfile = await updateProfile(formData)
      profile.setProfile(updatedProfile)

      setSuccessMessageVisible(true)

      setTimeout(() => {
        setSuccessMessageVisible(false)
      }, 2000)
    } catch (error) {
      alert('Ошибка при обновлении профиля!')
    }
  }

  const handleReset = async () => {
    const defaultForm =
      user.user.role === 'ADMIN'
        ? {
            firstName: 'Admin',
            lastName: 'Admin',
            phone: '',
            address: '',
          }
        : {
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
          }

    setForm({ ...defaultForm, photo: null })

    const formData = new FormData()
    for (const key in defaultForm) {
      formData.append(key, defaultForm[key])
    }
    formData.append('photo', '')

    try {
      const updatedProfile = await updateProfile(formData)
      profile.setProfile(updatedProfile)

      setSuccessMessageVisible(true)

      setTimeout(() => {
        setSuccessMessageVisible(false)
      }, 2000)
    } catch (error) {
      alert('Ошибка при сбросе данных профиля!')
    }
  }

  const handleCancelClick = (order) => {
    setSelectedOrder(order)
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    if (selectedOrder) {
      await transaction.cancelOrderById(selectedOrder.id)
      setShowCancelModal(false)
      setSelectedOrder(null)
    }
  }

  const handleViewOrderClick = async (orderId) => {
    try {
      const orderDetails = await fetchOrderDetails(orderId)
      setSelectedOrder(orderDetails)
      setShowOrderDetailsModal(true)
    } catch (error) {
      console.error('Ошибка при загрузке деталей заказа:', error)
    }
  }

  if (profile.loading) {
    return <Spinner animation="grow" />
  }

  if (profile.error) {
    return <div>{profile.error}</div>
  }

  return (
    <Container className="mt-4">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTeb(k)}
        className="mb-3"
      >
        <Tab eventKey="profile" title="Профиль">
          <h2>Профиль пользователя</h2>
          <Form onSubmit={handleSubmit}>
            <div className="text-center mb-3">
              {profile ? (
                <Image
                  src={`${
                    profile.profile?.photo
                      ? `${process.env.REACT_APP_API_URL}images/${profile.profile.photo}`
                      : `${process.env.REACT_APP_API_URL}images/user.png`
                  }`}
                  roundedCircle
                  height={225}
                  width={225}
                />
              ) : (
                <Spinner animation="border" />
              )}
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Фотография</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                isInvalid={!!errors.photo}
                style={{ cursor: 'pointer', width: 255 }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.photo}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Имя <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={form.firstName || ''}
                onChange={handleInputChange}
                isInvalid={errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Фамилия <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={form.lastName || ''}
                onChange={handleInputChange}
                isInvalid={errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Телефон <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={form.phone || ''}
                onChange={handleInputChange}
                isInvalid={errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Адрес <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={form.address || ''}
                onChange={handleInputChange}
                isInvalid={errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Сохранить изменения
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              variant="secondary"
              type="button"
              onClick={handleReset}
            >
              Сбросить данные
            </Button>
            <div
              style={{
                marginTop: '10px',
                color: 'green',
                fontWeight: 'bold',
                opacity: successMessageVisible ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
              }}
            >
              Данные успешно сохранены.
            </div>
          </Form>
        </Tab>
        <Tab eventKey="orders" title="Заказы">
          <h2>Мои заказы</h2>
          {transaction.loading ? (
            <Spinner animation="border" />
          ) : transaction.orders.length === 0 ? (
            <p>У вас нет заказов.</p>
          ) : (
            <Row className="g-4">
              {transaction.orders.map((order) => (
                <Col
                  key={order.id}
                  xs={12}
                  md={6}
                  lg={4}
                  style={{ marginBottom: '10px' }}
                >
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <Card.Title>Заказ #{order.id}</Card.Title>
                      <Card.Text>
                        <strong>Дата:</strong>{' '}
                        {new Date(order.createdAt).toLocaleString()}
                      </Card.Text>
                      <Card.Text>
                        <strong>Сумма:</strong> {order.totalPrice} руб. (
                        {usdRate
                          ? (order.totalPrice * usdRate).toFixed(2)
                          : '...'}
                        $)
                      </Card.Text>
                      <Card.Text>
                        <strong>Статус:</strong>{' '}
                        <span
                          className={
                            order.isCanceled ? 'text-danger' : 'text-success'
                          }
                        >
                          {order.isCanceled ? 'Отменен' : 'Активный'}
                        </span>
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="info"
                          onClick={() => handleViewOrderClick(order.id)}
                          style={{ marginRight: '10px' }}
                        >
                          Посмотреть заказ
                        </Button>
                        {!order.isCanceled && (
                          <Button
                            variant="danger"
                            onClick={() => handleCancelClick(order)}
                          >
                            Отменить заказ
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>

      <ConfirmationModal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Подтверждение отмены"
        message={`Вы уверены, что хотите отменить заказ #${selectedOrder?.id}?`}
      />

      <OrderDetailsModal
        show={showOrderDetailsModal}
        onHide={() => setShowOrderDetailsModal(false)}
        order={selectedOrder}
        usdRate={usdRate}
      />
    </Container>
  )
})

export default Profile
