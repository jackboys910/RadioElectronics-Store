import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Center,
  FormControl,
  Input,
  VStack,
  Text,
  Image,
  Spinner,
  HStack,
  ScrollView,
} from 'native-base'
import * as ImagePicker from 'expo-image-picker'
import { observer } from 'mobx-react-lite'
import { Context } from '../../Context'
import { fetchProfile, updateProfile } from '../../http/profileAPI'
import { profileValidationSchema } from '../../utils/validation/profileValidation'
import { REACT_APP_API_URL } from '@env'

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

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: false })
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

  const handleFileChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      const file = result.assets[0]
      setForm({ ...form, photo: file })

      try {
        await profileValidationSchema.validateAt('photo', { photo: file })
        setErrors({ ...errors, photo: null })
      } catch (error) {
        setErrors({ ...errors, photo: error.message })
      }
    }
  }

  const handleSubmit = async () => {
    const isValid = await validateForm()
    if (!isValid) {
      return
    }

    if (errors.photo) {
      return
    }

    const formData = new FormData()
    formData.append('firstName', form.firstName)
    formData.append('lastName', form.lastName)
    formData.append('phone', form.phone)
    formData.append('address', form.address)

    if (form.photo) {
      formData.append('photo', {
        uri: form.photo.uri,
        name: form.photo.uri.split('/').pop(),
        type: `image/${form.photo.uri.split('.').pop()}`,
      })
    }

    try {
      const updatedProfile = await updateProfile(formData)
      profile.setProfile(updatedProfile)

      setForm((prevForm) => ({ ...prevForm, photo: null }))

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
    return <Spinner color="blue.500" size="lg" />
  }

  if (profile.error) {
    return <Text color="red.500">{profile.error}</Text>
  }

  return (
    <ScrollView>
      <Box flex={1} p={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Профиль пользователя
        </Text>
        <Center>
          {profile ? (
            <Image
              source={{
                uri: profile.profile?.photo
                  ? `${REACT_APP_API_URL}/images/${profile.profile.photo}`
                  : `${REACT_APP_API_URL}/images/user.png`,
              }}
              alt="Profile Photo"
              size="xl"
              borderRadius="full"
            />
          ) : (
            <Spinner color="blue.500" size="lg" />
          )}
        </Center>

        <VStack space={4} mt={6}>
          <FormControl isInvalid={!!errors.firstName}>
            <FormControl.Label>Имя</FormControl.Label>
            <Input
              value={form.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
            />
            {'firstName' in errors && (
              <FormControl.ErrorMessage>
                {errors.firstName}
              </FormControl.ErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.lastName}>
            <FormControl.Label>Фамилия</FormControl.Label>
            <Input
              value={form.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
            />
            {'lastName' in errors && (
              <FormControl.ErrorMessage>
                {errors.lastName}
              </FormControl.ErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.phone}>
            <FormControl.Label>Телефон</FormControl.Label>
            <Input
              value={form.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
            {'phone' in errors && (
              <FormControl.ErrorMessage>
                {errors.phone}
              </FormControl.ErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.address}>
            <FormControl.Label>Адрес</FormControl.Label>
            <Input
              value={form.address}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            {'address' in errors && (
              <FormControl.ErrorMessage>
                {errors.address}
              </FormControl.ErrorMessage>
            )}
          </FormControl>

          <Button mt={4} onPress={handleFileChange}>
            Загрузить фото
          </Button>

          {form.photo && (
            <Text style={{ marginTop: '-10' }} mt={2} color="blue.500">
              Загруженный файл: {form.photo.uri.split('/').pop()}
            </Text>
          )}

          {errors.photo && (
            <Text style={{ marginTop: '-10' }} color="red.500" mt={2}>
              {errors.photo}
            </Text>
          )}

          <HStack space={4} mt={6}>
            <Button colorScheme="blue" flex={1} onPress={handleSubmit}>
              Сохранить изменения
            </Button>
            <Button colorScheme="secondary" flex={1} onPress={handleReset}>
              Сбросить данные
            </Button>
          </HStack>
        </VStack>

        {successMessageVisible && (
          <Text color="green.500" mt={4} textAlign="center">
            Данные успешно сохранены.
          </Text>
        )}
      </Box>
    </ScrollView>
  )
})

export default Profile
