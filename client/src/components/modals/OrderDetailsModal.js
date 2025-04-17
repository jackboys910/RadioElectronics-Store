import React from 'react'
import { Modal, Button, Table, Image } from 'react-bootstrap'

const OrderDetailsModal = ({ show, onHide, order, usdRate }) => {
  if (!order || !order.items) return null

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
              <th>Количество</th>
              <th>Цена (руб.)</th>
              <th>Цена ($)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Image
                    src={
                      item.img
                        ? `${process.env.REACT_APP_API_URL}${item.img}`
                        : ''
                    }
                    rounded
                    width={50}
                    height={50}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{usdRate ? (item.price * usdRate).toFixed(2) : '...'}$</td>
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
