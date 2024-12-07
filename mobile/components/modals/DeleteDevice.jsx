import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Modal, Button, Select, VStack, FormControl } from 'native-base'
import { deleteDevice, fetchAllDevices } from '../../http/deviceAPI'
import { Context } from '../../Context'

const DeleteDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context)

  useEffect(() => {
    if (show) {
      fetchAllDevices().then((data) => {
        device.setDevices(data.rows || [])
      })
    }
  }, [show])

  const handleDelete = async () => {
    if (device.selectedDevice) {
      await deleteDevice(device.selectedDevice.id)
      const updatedDevices = await fetchAllDevices()
      device.setDevices(updatedDevices.rows || [])
      device.setSelectedDevice(null)
      onHide()
    }
  }

  return (
    <Modal isOpen={show} onClose={onHide} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Удалить устройство</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>Выберите устройство</FormControl.Label>
              <Select
                selectedValue={device.selectedDevice?.id || ''}
                placeholder="Выберите устройство"
                onValueChange={(value) =>
                  device.setSelectedDevice(
                    device.devices.find((d) => d.id === value)
                  )
                }
              >
                {device.devices.map((device) => (
                  <Select.Item
                    key={device.id}
                    label={device.name}
                    value={device.id}
                  />
                ))}
              </Select>
            </FormControl>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="outline" colorScheme="danger" onPress={onHide}>
              Закрыть
            </Button>
            <Button
              colorScheme="success"
              onPress={handleDelete}
              isDisabled={!device.selectedDevice}
            >
              Удалить
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
})

export default DeleteDevice
