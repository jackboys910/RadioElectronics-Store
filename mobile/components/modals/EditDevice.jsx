import React, { useState, useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Modal,
  Button,
  Text,
  FormControl,
  Input,
  Select,
  VStack,
} from 'native-base'
import {
  fetchAllDevices,
  fetchBrands,
  fetchTypes,
  updateDevice,
} from '../../http/deviceAPI'
import { Context } from '../../Context'
import { createDeviceValidationSchema } from '../../utils/validation/adminPanelValidation'
import * as ImagePicker from 'expo-image-picker'

const EditDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (show) {
      fetchAllDevices().then((data) => {
        device.setDevices(data.rows || [])
      })
    }
  }, [show])

  useEffect(() => {
    fetchAllDevices().then((data) => device.setDevices(data.rows || []))
    fetchTypes().then((data) => device.setTypes(data))
    fetchBrands().then((data) => device.setBrands(data))
  }, [device])

  const handleDeviceSelection = (value) => {
    const selected = device.devices.find((d) => d.id === Number(value))
    setSelectedDevice(selected)

    if (selected) {
      setName(selected.name)
      setPrice(selected.price.toString())
      device.setSelectedType(
        device.types.find((type) => type.id === selected.typeId)
      )
      device.setSelectedBrand(
        device.brands.find((brand) => brand.id === selected.brandId)
      )
    } else {
      setName('')
      setPrice('')
      device.setSelectedType(null)
      device.setSelectedBrand(null)
    }
  }

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setFile({
        uri: result.assets[0].uri,
        name: result.assets[0].uri.split('/').pop(),
        type: `image/${result.assets[0].uri.split('.').pop()}`,
      })
    }
  }

  const handleUpdate = async () => {
    try {
      await createDeviceValidationSchema.validate(
        { name, price, file },
        { abortEarly: false }
      )

      const formData = new FormData()
      formData.append('name', name)
      formData.append('price', price)
      formData.append('brandId', device.selectedBrand.id)
      formData.append('typeId', device.selectedType.id)

      formData.append('img', file)

      await updateDevice(selectedDevice.id, formData)

      const updatedDevices = await fetchAllDevices()
      device.setDevices(updatedDevices.rows || [])

      setErrors({})
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
        <Modal.Header>Редактировать устройство</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <Select
              selectedValue={selectedDevice?.id?.toString() || ''}
              placeholder="Выберите устройство"
              onValueChange={handleDeviceSelection}
            >
              {device.devices.map((d) => (
                <Select.Item
                  key={d.id}
                  label={d.name}
                  value={d.id.toString()}
                />
              ))}
            </Select>

            {selectedDevice && (
              <>
                <FormControl>
                  <FormControl.Label>Название устройства</FormControl.Label>
                  <Input value={name} onChangeText={setName} />
                  {errors.name && (
                    <FormControl.ErrorMessage>
                      {errors.name}
                    </FormControl.ErrorMessage>
                  )}
                </FormControl>

                <FormControl>
                  <FormControl.Label>Цена устройства</FormControl.Label>
                  <Input
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                  />
                  {errors.price && (
                    <FormControl.ErrorMessage>
                      {errors.price}
                    </FormControl.ErrorMessage>
                  )}
                </FormControl>

                <FormControl>
                  <FormControl.Label>Тип устройства</FormControl.Label>
                  <Select
                    selectedValue={device.selectedType?.id || ''}
                    onValueChange={(value) =>
                      device.setSelectedType(
                        device.types.find((type) => type.id === Number(value))
                      )
                    }
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
                  <FormControl.Label>Бренд устройства</FormControl.Label>
                  <Select
                    selectedValue={device.selectedBrand?.id || ''}
                    onValueChange={(value) =>
                      device.setSelectedBrand(
                        device.brands.find(
                          (brand) => brand.id === Number(value)
                        )
                      )
                    }
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

                <Button onPress={selectImage}>Выбрать изображение</Button>
                {file && <Text>Файл выбран: {file.name}</Text>}
              </>
            )}
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="outline" colorScheme="danger" onPress={onHide}>
              Закрыть
            </Button>
            <Button
              colorScheme="success"
              onPress={handleUpdate}
              isDisabled={!selectedDevice}
            >
              Сохранить
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
})

export default EditDevice
