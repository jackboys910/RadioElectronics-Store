import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Modal, Button, FormControl, Select, VStack } from 'native-base'
import { fetchBrands, deleteBrand } from '../../http/deviceAPI'
import { Context } from '../../Context'

const DeleteBrand = observer(({ show, onHide }) => {
  const { device } = useContext(Context)
  const [selectedBrandId, setSelectedBrandId] = useState('')

  const removeBrand = async () => {
    if (selectedBrandId) {
      await deleteBrand(selectedBrandId)
      const updatedBrands = await fetchBrands()
      device.setBrands(updatedBrands)
      setSelectedBrandId('')
      onHide()
    }
  }

  return (
    <Modal isOpen={show} onClose={onHide} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Удалить бренд</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>Выберите бренд</FormControl.Label>
              <Select
                selectedValue={selectedBrandId?.id?.toString()}
                placeholder="Выберите бренд"
                onValueChange={(value) => setSelectedBrandId(value)}
              >
                {device.brands.map((brand) => (
                  <Select.Item
                    key={brand.id}
                    label={brand.name}
                    value={brand.id}
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
              onPress={removeBrand}
              isDisabled={!selectedBrandId}
            >
              Удалить
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
})

export default DeleteBrand
