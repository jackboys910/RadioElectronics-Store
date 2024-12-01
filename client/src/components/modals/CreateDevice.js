import React, { useContext, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Button, Dropdown, Form, Row, Col } from 'react-bootstrap'
import { Context } from '../../index'
import {
  createDevice,
  fetchBrands,
  fetchTypes,
  fetchDevices,
} from '../../http/deviceAPI'
import { observer } from 'mobx-react-lite'
import { createDeviceValidationSchema } from '../../utils/validation/adminPanelValidation'

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
  }, [])

  const addInfo = () => {
    setInfo([...info, { title: '', description: '', number: Date.now() }])
  }
  const removeInfo = (number) => {
    setInfo(info.filter((i) => i.number !== number))
  }
  const changeInfo = (key, value, number) => {
    setInfo(info.map((i) => (i.number === number ? { ...i, [key]: value } : i)))
  }

  const selectFile = (e) => {
    setFile(e.target.files[0])
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
      formData.append('img', file)
      formData.append('brandId', device.selectedBrand.id)
      formData.append('typeId', device.selectedType.id)
      formData.append('info', JSON.stringify(info))
      await createDevice(formData)

      const updatedTypes = await fetchTypes()
      const updatedBrands = await fetchBrands()
      const updatedDevices = await fetchDevices()
      device.setTypes(updatedTypes)
      device.setBrands(updatedBrands)
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
      } else {
        if (error.message === 'Выберите тип устройства') {
          validationErrors.type = error.message
        }
        if (error.message === 'Выберите бренд устройства') {
          validationErrors.brand = error.message
        }
      }

      setErrors(validationErrors)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить устройство
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {device.selectedType.name || 'Выберите тип'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'scroll' }}>
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
            <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'scroll' }}>
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
          <Form.Control
            className="mt-3"
            type="file"
            onChange={selectFile}
            isInvalid={!!errors.file}
            style={{ cursor: 'pointer', width: 255 }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.file}
          </Form.Control.Feedback>
          <hr />
          <Button variant={'outline-dark'} onClick={addInfo}>
            Добавить новое свойство
          </Button>
          {info.map((i) => (
            <Row className="mt-4" key={i.number}>
              <Col md={4}>
                <Form.Control
                  value={i.title}
                  onChange={(e) =>
                    changeInfo('title', e.target.value, i.number)
                  }
                  placeholder="Введите название свойства"
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  value={i.description}
                  onChange={(e) =>
                    changeInfo('description', e.target.value, i.number)
                  }
                  placeholder="Введите описание свойства"
                />
              </Col>
              <Col md={4}>
                <Button
                  onClick={() => removeInfo(i.number)}
                  variant={'outline-danger'}
                >
                  Удалить
                </Button>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addDevice}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

export default CreateDevice
