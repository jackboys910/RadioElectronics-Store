import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Modal, Button, FormControl, Input, VStack } from 'native-base'
import { createType, fetchTypes } from '../../http/deviceAPI'
import { createTypeValidationSchema } from '../../utils/validation/adminPanelValidation'
import { Context } from '../../Context'

const CreateType = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const addType = async () => {
    try {
      await createTypeValidationSchema.validate({ type: value })

      await createType({ name: value })

      const updatedTypes = await fetchTypes()
      device.setTypes(updatedTypes)

      setValue('')
      setError('')
      onHide()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  return (
    <Modal isOpen={show} onClose={onHide} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Добавить тип</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <FormControl isInvalid={!!error}>
              <FormControl.Label>Название типа</FormControl.Label>
              <Input
                placeholder="Введите название типа"
                value={value}
                onChangeText={setValue}
              />
              {error ? (
                <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
              ) : null}
            </FormControl>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="outline" colorScheme="danger" onPress={onHide}>
              Закрыть
            </Button>
            <Button colorScheme="success" onPress={addType}>
              Добавить
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
})

export default CreateType
