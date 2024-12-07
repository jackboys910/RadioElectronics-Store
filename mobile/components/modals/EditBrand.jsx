import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Modal,
  Button,
  FormControl,
  Input,
  Select,
  VStack,
  Text,
} from 'native-base'
import { fetchBrands, updateBrand } from '../../http/deviceAPI'
import { createBrandValidationSchema } from '../../utils/validation/adminPanelValidation'
import { Context } from '../../Context'

const EditBrand = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const editBrand = async () => {
    try {
      await createBrandValidationSchema.validate({ brand: value })

      await updateBrand(selectedBrand.id, { name: value })

      const updatedBrands = await fetchBrands()
      device.setBrands(updatedBrands)

      setValue('')
      setSelectedBrand(null)
      setError('')
      onHide()
    } catch (err) {
      setError('Такой бренд уже существует')
    }
  }

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand)
    setValue(brand.name)
    setError('')
  }

  return (
    <Modal isOpen={show} onClose={onHide} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Редактировать бренд</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>Выберите бренд</FormControl.Label>
              <Select
                selectedValue={selectedBrand?.id?.toString() || ''}
                placeholder="Выберите бренд"
                onValueChange={(value) =>
                  handleBrandSelect(
                    device.brands.find((b) => b.id === Number(value))
                  )
                }
              >
                {device.brands.map((brand) => (
                  <Select.Item
                    key={brand.id}
                    label={brand.name}
                    value={brand.id.toString()}
                  />
                ))}
              </Select>
            </FormControl>

            {selectedBrand && (
              <FormControl isInvalid={!!error}>
                <FormControl.Label>Новое название</FormControl.Label>
                <Input
                  value={value}
                  onChangeText={setValue}
                  placeholder="Введите новое название"
                />
                {error ? <Text color="red.500">{error}</Text> : null}
              </FormControl>
            )}
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="outline" colorScheme="danger" onPress={onHide}>
              Закрыть
            </Button>
            <Button
              colorScheme="success"
              onPress={editBrand}
              isDisabled={!selectedBrand}
            >
              Сохранить
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
})

export default EditBrand
