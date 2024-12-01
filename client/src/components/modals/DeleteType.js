import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Modal from 'react-bootstrap/Modal'
import { Button, Form } from 'react-bootstrap'
import { fetchTypes, deleteType } from '../../http/deviceAPI'
import { Context } from '../../index'

const DeleteType = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [selectedType, setSelectedType] = useState(null)

  const removeType = async () => {
    if (selectedType) {
      await deleteType(selectedType.id)
      const updatedTypes = await fetchTypes()
      device.setTypes(updatedTypes)
      setSelectedType(null)
      onHide()
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить тип</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Выберите тип</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) =>
                setSelectedType(
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button
          variant="outline-success"
          onClick={removeType}
          disabled={!selectedType}
        >
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

export default DeleteType
