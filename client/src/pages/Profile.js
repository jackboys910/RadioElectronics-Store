import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../index'
import { Button, Container, Form, Image, Spinner } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { fetchProfile, updateProfile } from '../http/profileAPI'
import { profileValidationSchema } from '../utils/validation/profileValidation'

const Profile = observer(() => {
  const { profile, user } = useContext(Context)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    photo: null,
  })
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [errors, setErrors] = useState({})

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

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: false })
  }

  // const validateForm = () => {
  //   const newErrors = {}
  //   if (!form.firstName) newErrors.firstName = true
  //   if (!form.lastName) newErrors.lastName = true
  //   if (!form.phone) newErrors.phone = true
  //   if (!form.address) newErrors.address = true
  //   setErrors(newErrors)
  //   return Object.keys(newErrors).length === 0
  // }

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
    </Container>
  )
})

export default Profile
