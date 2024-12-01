import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Modal from 'react-bootstrap/Modal'
import { Button, Form } from 'react-bootstrap'
import { createBrand, fetchBrands } from '../../http/deviceAPI'
import { createBrandValidationSchema } from '../../utils/validation/adminPanelValidation'
import { Context } from '../../index'

const CreateBrand = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const addBrand = async () => {
    try {
      await createBrandValidationSchema.validate({ brand: value })

      await createBrand({ name: value })

      const updatedBrands = await fetchBrands()
      device.setBrands(updatedBrands)

      setValue('')
      setError('')
      onHide()
    } catch (error) {
      setError(error.response?.data?.message || error.message)
    }
  }
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить бренд
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={'Введите название бренда'}
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
})

export default CreateBrand
