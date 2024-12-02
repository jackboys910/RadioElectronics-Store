import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Modal from 'react-bootstrap/Modal'
import { Button, Form } from 'react-bootstrap'
import { fetchBrands, updateBrand } from '../../http/deviceAPI'
import { createBrandValidationSchema } from '../../utils/validation/adminPanelValidation'
import { Context } from '../../index'

const EditBrand = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const editBrand = async () => {
    try {
      await createBrandValidationSchema.validate({ brand: value })
      await updateBrand(selectedBrand.id, { name: value })

      const updatedBrands = await fetchBrands()
      device.setBrands(updatedBrands)

      setValue('')
      setSelectedBrand(null)
      setError('')
      onHide()
    } catch (err) {
      setError('Такой бренд уже существует')
    }
  }

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand)
    setValue(brand.name)
    setError('')
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Редактировать бренд</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Выберите бренд</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) =>
                handleBrandSelect(
                  device.brands?.find((b) => b.id === parseInt(e.target.value))
                )
              }
            >
              <option value="">Выберите бренд</option>
              {device.brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {selectedBrand && (
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
          onClick={editBrand}
          disabled={!selectedBrand}
        >
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

export default EditBrand
