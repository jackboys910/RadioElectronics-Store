import React, { useState, useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Modal from 'react-bootstrap/Modal'
import { Button, Dropdown, Form } from 'react-bootstrap'
import {
  fetchDevices,
  fetchBrands,
  fetchTypes,
  updateDevice,
} from '../../http/deviceAPI'
import { Context } from '../../index'
import { createDeviceValidationSchema } from '../../utils/validation/adminPanelValidation'

const EditDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchDevices().then((data) => device.setDevices(data.rows || []))
    fetchTypes().then((data) => device.setTypes(data))
    fetchBrands().then((data) => device.setBrands(data))
  }, [device])

  const handleSelectDevice = (id) => {
    const selected = device.devices.find((d) => d.id === id)
    if (selected) {
      setSelectedDevice(selected)
      setName(selected.name)
      setPrice(selected.price)
      device.setSelectedType(
        device.types.find((type) => type.id === selected.typeId) || {}
      )
      device.setSelectedBrand(
        device.brands.find((brand) => brand.id === selected.brandId) || {}
      )
      setFile(null)
      setErrors({})
    }
  }

  const selectFile = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpdate = async () => {
    try {
      await createDeviceValidationSchema.validate(
        { name, price, file },
        { abortEarly: false }
      )

      const formData = new FormData()
      formData.append('name', name)
      formData.append('price', `${price}`)
      formData.append('img', file)
      formData.append('brandId', device.selectedBrand.id)
      formData.append('typeId', device.selectedType.id)

      await updateDevice(selectedDevice.id, formData)

      const updatedDevices = await fetchDevices()
      device.setDevices(updatedDevices.rows || [])

      onHide()
    } catch (error) {
      const validationErrors = {}
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message
      })
      setErrors(validationErrors)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Редактировать устройство</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {selectedDevice?.name || 'Выберите устройство'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'scroll' }}>
              {device.devices.map((d) => (
                <Dropdown.Item
                  onClick={() => handleSelectDevice(d.id)}
                  key={d.id}
                >
                  {d.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {selectedDevice && (
            <>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-3"
                placeholder="Введите название устройства"
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>

              <Form.Control
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-3"
                placeholder="Введите стоимость устройства"
                type="number"
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.price}
              </Form.Control.Feedback>

              <Dropdown className="mt-2 mb-2">
                <Dropdown.Toggle>
                  {device.selectedType.name || 'Выберите тип'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {device.types.map((type) => (
                    <Dropdown.Item
                      onClick={() => device.setSelectedType(type)}
                      key={type.id}
                    >
                      {type.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown className="mt-2 mb-2">
                <Dropdown.Toggle>
                  {device.selectedBrand.name || 'Выберите бренд'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {device.brands.map((brand) => (
                    <Dropdown.Item
                      onClick={() => device.setSelectedBrand(brand)}
                      key={brand.id}
                    >
                      {brand.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Form.Control
                className="mt-3"
                type="file"
                onChange={selectFile}
                isInvalid={!!errors.file}
              />
              <Form.Control.Feedback type="invalid">
                {errors.file}
              </Form.Control.Feedback>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button
          variant="outline-success"
          onClick={handleUpdate}
          disabled={!selectedDevice}
        >
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

export default EditDevice
