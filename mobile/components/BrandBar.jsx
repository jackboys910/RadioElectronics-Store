import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../Context'
import { HStack, Pressable, Box, Text } from 'native-base'

const BrandBar = observer(() => {
  const { device } = useContext(Context)

  return (
    <HStack space={2} flexWrap="wrap">
      {device.brands.map((brand) => (
        <Pressable
          key={brand.id}
          onPress={() => device.setSelectedBrand(brand)}
        >
          <Box
            p={3}
            borderWidth={1}
            borderColor={
              brand.id === device.selectedBrand.id ? 'danger.500' : 'gray.300'
            }
            borderRadius="md"
            bg={brand.id === device.selectedBrand.id ? 'danger.100' : 'white'}
          >
            <Text>{brand.name}</Text>
          </Box>
        </Pressable>
      ))}
    </HStack>
  )
})

export default BrandBar
