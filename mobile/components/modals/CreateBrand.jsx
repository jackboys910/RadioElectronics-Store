import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Modal, FormControl, Button, VStack, Input } from 'native-base'
import { createBrand, fetchBrands } from '../../http/deviceAPI'
import { createBrandValidationSchema } from '../../utils/validation/adminPanelValidation'
import { Context } from '../../Context'

const CreateBrand = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const addBrand = async () => {
    try {
      await createBrandValidationSchema.validate({ brand: value })

      await createBrand({ name: value })

      const updatedBrands = await fetchBrands()
      device.setBrands(updatedBrands)

      setValue('')
      setError('')
      onHide()
    } catch (err) {
      setError(err.message || 'Произошла ошибка')
    }
  }

  return (
    <Modal isOpen={show} onClose={onHide} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Добавить бренд</Modal.Header>

        <Modal.Body>
          <VStack space={4}>
            <FormControl isInvalid={!!error}>
              <FormControl.Label>Название бренда</FormControl.Label>
              <Input
                placeholder="Введите название бренда"
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
            <Button onPress={addBrand} colorScheme="success">
              Добавить
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
})

export default CreateBrand
