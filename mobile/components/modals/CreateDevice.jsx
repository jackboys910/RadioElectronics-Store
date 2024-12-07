import React, { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Modal,
  Button,
  VStack,
  FormControl,
  Input,
  Select,
  Text,
  ScrollView,
  Box,
} from 'native-base'
import { Context } from '../../Context'
import {
  fetchBrands,
  fetchTypes,
  createDevice,
  fetchDevices,
} from '../../http/deviceAPI'
import { createDeviceValidationSchema } from '../../utils/validation/adminPanelValidation'
import * as ImagePicker from 'expo-image-picker'

const CreateDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState(null)
  const [info, setInfo] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data))
    fetchBrands().then((data) => device.setBrands(data))
  }, [device])

  const addInfo = () => {
    setInfo([...info, { title: '', description: '', number: Date.now() }])
  }

  const removeInfo = (number) => {
    setInfo(info.filter((i) => i.number !== number))
  }

  const changeInfo = (key, value, number) => {
    setInfo(info.map((i) => (i.number === number ? { ...i, [key]: value } : i)))
  }

  const pickImage = async () => {
    // const permissionResult =
    //   await ImagePicker.requestMediaLibraryPermissionsAsync()

    // if (!permissionResult.granted) {
    //   alert('Permission to access media library is required!')
    //   return
    // }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri

      setFile({
        uri,
        name: uri.split('/').pop(),
        type: `image/${uri.split('.').pop()}`,
      })
    } else {
      console.log('Image picker canceled or no image selected.')
    }
  }

  const addDevice = async () => {
    try {
      await createDeviceValidationSchema.validate(
        { name, price, file },
        { abortEarly: false }
      )

      const formData = new FormData()
      formData.append('name', name)
      formData.append('price', `${price}`)
      formData.append('brandId', device.selectedBrand.id)
      formData.append('typeId', device.selectedType.id)
      formData.append('info', JSON.stringify(info))

      if (file) {
        formData.append('img', {
          uri: file.uri,
          name: file.name || 'image.jpg',
          type: file.type || 'image/jpeg',
        })
      } else {
        throw new Error('Не выбрано изображение.')
      }
      await createDevice(formData)

      const updatedDevices = await fetchDevices()
      device.setDevices(updatedDevices.rows || [])

      setName('')
      setPrice('')
      setFile(null)
      setInfo([])
      onHide()
    } catch (error) {
      const validationErrors = {}
      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message
        })
      }
      setErrors(validationErrors)
    }
  }

  return (
    <Modal isOpen={show} onClose={onHide} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Добавить устройство</Modal.Header>
        <Modal.Body>
          <ScrollView>
            <VStack space={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormControl.Label>Название устройства</FormControl.Label>
                <Input
                  placeholder="Введите название"
                  value={name}
                  onChangeText={setName}
                />
                {errors.name && (
                  <FormControl.ErrorMessage>
                    {errors.name}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.price}>
                <FormControl.Label>Цена устройства</FormControl.Label>
                <Input
                  placeholder="Введите цену"
                  value={price}
                  keyboardType="numeric"
                  onChangeText={setPrice}
                />
                {errors.price && (
                  <FormControl.ErrorMessage>
                    {errors.price}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormControl.Label>Выберите тип</FormControl.Label>
                <Select
                  selectedValue={device.selectedType?.id}
                  onValueChange={(value) =>
                    device.setSelectedType(
                      device.types.find((type) => type.id === value)
                    )
                  }
                  placeholder="Выберите тип"
                >
                  {device.types.map((type) => (
                    <Select.Item
                      key={type.id}
                      label={type.name}
                      value={type.id}
                    />
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormControl.Label>Выберите бренд</FormControl.Label>
                <Select
                  selectedValue={device.selectedBrand?.id}
                  onValueChange={(value) =>
                    device.setSelectedBrand(
                      device.brands.find((brand) => brand.id === value)
                    )
                  }
                  placeholder="Выберите бренд"
                >
                  {device.brands.map((brand) => (
                    <Select.Item
                      key={brand.id}
                      label={brand.name}
                      value={brand.id}
                    />
                  ))}
                </Select>
              </FormControl>

              <Button onPress={pickImage}>Выберите изображение</Button>
              {file ? (
                <Text mt={2} color="green.500">
                  Выбрано изображение: {file.name || file.uri.split('/').pop()}
                </Text>
              ) : (
                <Text mt={2} color="red.500">
                  Изображение не выбрано
                </Text>
              )}

              <Button onPress={addInfo}>Добавить новое свойство</Button>
              {info.map((i) => (
                <Box key={i.number} mt={4}>
                  <Input
                    placeholder="Название свойства"
                    value={i.title}
                    onChangeText={(text) => changeInfo('title', text, i.number)}
                  />
                  <Input
                    placeholder="Описание свойства"
                    value={i.description}
                    onChangeText={(text) =>
                      changeInfo('description', text, i.number)
                    }
                  />
                  <Button onPress={() => removeInfo(i.number)}>Удалить</Button>
                </Box>
              ))}
            </VStack>
          </ScrollView>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="outline" colorScheme="danger" onPress={onHide}>
              Закрыть
            </Button>
            <Button colorScheme="success" onPress={addDevice}>
              Добавить
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
})

export default CreateDevice
