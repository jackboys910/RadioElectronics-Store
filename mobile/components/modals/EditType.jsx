import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Modal,
  FormControl,
  Input,
  Button,
  Select,
  VStack,
  Text,
  WarningOutlineIcon,
} from 'native-base'
import { fetchTypes, updateType } from '../../http/deviceAPI'
import { createTypeValidationSchema } from '../../utils/validation/adminPanelValidation'
import { Context } from '../../Context'

const EditType = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [selectedType, setSelectedType] = useState(null)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const editType = async () => {
    try {
      await createTypeValidationSchema.validate({ type: value })
      await updateType(selectedType.id, { name: value })

      const updatedTypes = await fetchTypes()
      device.setTypes(updatedTypes)

      setValue('')
      setSelectedType(null)
      setError('')
      onHide()
    } catch (err) {
      setError('Такой тип уже существует')
    }
  }

  const handleTypeSelect = (typeId) => {
    const type = device.types.find((t) => t.id === parseInt(typeId))
    if (type) {
      setSelectedType(type)
      setValue(type.name)
      setError('')
    }
  }

  return (
    <Modal isOpen={show} onClose={onHide}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Редактировать тип</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <Text>Выберите тип</Text>
            <Select
              selectedValue={selectedType?.id?.toString() || ''}
              onValueChange={handleTypeSelect}
              placeholder="Выберите тип"
              isDisabled={!device.types.length}
            >
              {device.types.map((type) => (
                <Select.Item
                  key={type.id}
                  label={type.name}
                  value={type.id.toString()}
                />
              ))}
            </Select>
            {selectedType && (
              <>
                <Text>Новое название</Text>
                <FormControl isInvalid={!!error}>
                  <Input
                    value={value}
                    onChangeText={(text) => setValue(text)}
                  />
                  {error ? (
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {error}
                    </FormControl.ErrorMessage>
                  ) : null}
                </FormControl>
              </>
            )}
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="red" onPress={onHide}>
              Закрыть
            </Button>
            <Button
              colorScheme="green"
              onPress={editType}
              isDisabled={!selectedType}
            >
              Сохранить
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
})

export default EditType
