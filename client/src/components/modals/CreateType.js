import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button } from 'react-bootstrap'
import { createType } from '../../http/deviceAPI'
import { createTypeValidationSchema } from '../../utils/validation/adminPanelValidation'

const CreateType = ({ show, onHide }) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const addType = async () => {
    try {
      await createTypeValidationSchema.validate({ type: value })

      createType({ name: value }).then((data) => {
        setValue('')
        onHide()
      })
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить тип
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={'Введите название типа'}
            isInvalid={!!error}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addType}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateType
