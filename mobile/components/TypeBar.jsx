import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../Context'
import { VStack, Pressable, Box, Text } from 'native-base'

const TypeBar = observer(() => {
  const { device } = useContext(Context)

  return (
    <VStack space={2}>
      {device.types.map((type) => (
        <Pressable key={type.id} onPress={() => device.setSelectedType(type)}>
          <Box
            bg={type.id === device.selectedType.id ? 'primary.500' : 'gray.200'}
            p={2}
            borderRadius="md"
          >
            <Text
              color={type.id === device.selectedType.id ? 'white' : 'black'}
            >
              {type.name}
            </Text>
          </Box>
        </Pressable>
      ))}
    </VStack>
  )
})

export default TypeBar
