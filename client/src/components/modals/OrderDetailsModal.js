import React from 'react'
import { Modal, Button, Table, Image } from 'react-bootstrap'
import { truncate } from '../../utils/truncate'

const OrderDetailsModal = ({ show, onHide, order, usdRate }) => {
  if (!order || !order.devices) return null

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Детали заказа #{order.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Фото</th>
              <th>Название</th>
              <th>Цена (руб.)</th>
              <th>Цена ($)</th>
            </tr>
          </thead>
          <tbody>
            {order.devices.map((device, index) => (
              <tr key={index}>
                <td>
                  <Image
                    src={
                      device.img
                        ? process.env.REACT_APP_API_URL + device.img
                        : ''
                    }
                    rounded
                    width={50}
                    height={50}
                  />
                </td>
                <td>{truncate(device.name, 15)}</td>
                <td>{device.price}</td>
                <td>
                  {usdRate ? (device.price * usdRate).toFixed(2) : '...'}$
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default OrderDetailsModal
