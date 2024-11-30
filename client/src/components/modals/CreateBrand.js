import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Button, Form } from 'react-bootstrap'
import { createBrand } from '../../http/deviceAPI'
import { createBrandValidationSchema } from '../../utils/validation/adminPanelValidation'

const CreateBrand = ({ show, onHide }) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const addBrand = async () => {
    try {
      await createBrandValidationSchema.validate({ brand: value })

      createBrand({ name: value }).then((data) => {
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
        <Button variant="outline-success" onClick={addBrand}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateBrand
