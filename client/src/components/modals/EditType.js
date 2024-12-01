import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Modal from 'react-bootstrap/Modal'
import { Button, Form } from 'react-bootstrap'
import { fetchTypes, updateType } from '../../http/deviceAPI'
import { createTypeValidationSchema } from '../../utils/validation/adminPanelValidation'
import { Context } from '../../index'

const EditType = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [selectedType, setSelectedType] = useState(null)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const editType = async () => {
    try {
      await createTypeValidationSchema.validate({ type: value })
      await updateType(selectedType.id, { name: value })

      const updatedTypes = await fetchTypes()
      device.setTypes(updatedTypes)

      setValue('')
      setSelectedType(null)
      setError('')
      onHide()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setValue(type.name)
    setError('')
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Редактировать тип</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Выберите тип</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) =>
                handleTypeSelect(
                  device.types.find((t) => t.id === parseInt(e.target.value))
                )
              }
            >
              <option value="">Выберите тип</option>
              {device.types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {selectedType && (
            <>
              <Form.Group className="mt-3">
                <Form.Label>Новое название</Form.Label>
                <Form.Control
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  isInvalid={!!error}
                />
                <Form.Control.Feedback type="invalid">
                  {error}
                </Form.Control.Feedback>
              </Form.Group>
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
          onClick={editType}
          disabled={!selectedType}
        >
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

export default EditType
