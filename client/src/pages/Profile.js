import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../index'
import { Button, Container, Form, Image, Spinner } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { fetchProfile, updateProfile } from '../http/profileAPI'

const Profile = observer(() => {
  const { profile } = useContext(Context)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    photo: null,
  })
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      profile.setLoading(true)
      try {
        const data = await fetchProfile()
        profile.setProfile(data)
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          address: data.address || '',
          photo: null,
        })
        profile.setError(null)
      } catch (error) {
        profile.setError('Ошибка загрузки профиля. Попробуйте позже.')
      } finally {
        profile.setLoading(false)
      }
    }

    loadProfile()
  }, [profile])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setForm({ ...form, photo: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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

  if (profile.loading) {
    return <Spinner animation="grow" />
  }

  if (profile.error) {
    return <div>{profile.error}</div>
  }

  return (
    <Container className="mt-4">
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
            style={{ cursor: 'pointer', width: 255 }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={form.firstName || ''}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={form.lastName || ''}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Телефон</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={form.phone || ''}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Адрес</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={form.address || ''}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Сохранить изменения
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
    </Container>
  )
})

export default Profile
