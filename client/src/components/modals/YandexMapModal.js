import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import YandexMap from '../YandexMap'

const YandexMapModal = ({ show, onHide, onAddressSelect }) => {
  const [selectedAddress, setSelectedAddress] = useState('')
  const [coordinates, setCoordinates] = useState([53.9, 27.5667])

  const handleAddressSelect = (address, coords) => {
    setSelectedAddress(address)
    setCoordinates(coords)
  }

  const handleConfirm = () => {
    onAddressSelect(selectedAddress)
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Выберите адрес на карте</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <YandexMap
          defaultCoordinates={coordinates}
          onAddressSelect={handleAddressSelect}
        />
        <div className="mt-3">
          <strong>Выбранный адрес:</strong> {selectedAddress || 'Не выбран'}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!selectedAddress}
        >
          Подтвердить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default YandexMapModal
