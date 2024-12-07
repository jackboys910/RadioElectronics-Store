import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Modal, Button, FormControl, Select, VStack } from 'native-base'
import { fetchTypes, deleteType } from '../../http/deviceAPI'
import { Context } from '../../Context'

const DeleteType = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [selectedType, setSelectedType] = useState(null)

  const removeType = async () => {
    if (selectedType) {
      await deleteType(selectedType.id)
      const updatedTypes = await fetchTypes()
      device.setTypes(updatedTypes)
      setSelectedType(null)
      onHide()
    }
  }

  return (
    <Modal isOpen={show} onClose={onHide} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Удалить тип</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>Выберите тип</FormControl.Label>
              <Select
                selectedValue={selectedType?.id?.toString() || ''}
                placeholder="Выберите тип"
                onValueChange={(value) =>
                  setSelectedType(
                    device.types.find((t) => t.id === Number(value))
                  )
                }
              >
                {device.types.map((type) => (
                  <Select.Item
                    key={type.id}
                    label={type.name}
                    value={type.id.toString()}
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
              onPress={removeType}
              isDisabled={!selectedType}
            >
              Удалить
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
})

export default DeleteType
