import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Modal from 'react-bootstrap/Modal'
import { Button, Form } from 'react-bootstrap'
import { fetchBrands, deleteBrand } from '../../http/deviceAPI'
import { Context } from '../../index'

const DeleteBrand = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [selectedBrand, setSelectedBrand] = useState(null)

  const removeBrand = async () => {
    if (selectedBrand) {
      await deleteBrand(selectedBrand.id)
      const updatedBrands = await fetchBrands()
      device.setBrands(updatedBrands)
      setSelectedBrand(null)
      onHide()
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить бренд</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Выберите бренд</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) =>
                setSelectedBrand(
                  device.brands.find((b) => b.id === parseInt(e.target.value))
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button
          variant="outline-success"
          onClick={removeBrand}
          disabled={!selectedBrand}
        >
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

export default DeleteBrand
