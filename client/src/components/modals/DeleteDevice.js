import React, { useContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Button, Dropdown } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { deleteDevice, fetchDevices } from '../../http/deviceAPI'
import { Context } from '../../index'

const DeleteDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context)

  const handleDelete = async () => {
    if (device.selectedDevice) {
      await deleteDevice(device.selectedDevice.id)
      const updatedDevices = await fetchDevices()
      device.setDevices(updatedDevices.rows || [])
      device.setSelectedDevice(null)
      onHide()
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить устройство</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown className="mt-2 mb-2">
          <Dropdown.Toggle>
            {device.selectedDevice?.name || 'Выберите устройство'}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            {device.devices.map((d) => (
              <Dropdown.Item
                onClick={() => device.setSelectedDevice(d)}
                key={d.id}
              >
                {d.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button
          variant="outline-success"
          onClick={handleDelete}
          disabled={!device.selectedDevice}
        >
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

export default DeleteDevice
