import React, { useState, useEffect, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Box, Image, Text, VStack, HStack, Pressable } from 'native-base'
import { View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { DEVICE_ROUTE } from '../utils/consts'
import { fetchAverageRating } from '../http/ratingAPI'
import { truncate } from '../utils/truncate'
import { REACT_APP_API_URL } from '@env'

const DeviceItem = ({ device }) => {
  const navigation = useNavigation()
  const [averageRating, setAverageRating] = useState(0)

  useFocusEffect(
    useCallback(() => {
      let isMounted = true
      fetchAverageRating(device.id).then((rating) => {
        if (isMounted) setAverageRating(rating)
      })
      return () => {
        isMounted = false
      }
    }, [device.id])
  )

  return (
    <Pressable
      onPress={() => navigation.navigate(DEVICE_ROUTE, { id: device.id })}
    >
      <Box
        w="150px"
        m={2}
        p={2}
        borderWidth={1}
        borderColor="gray.300"
        borderRadius="md"
      >
        <Image
          source={{ uri: `${REACT_APP_API_URL}/${device.img}` }}
          alt={device.name}
          size="xl"
          resizeMode="contain"
        />
        <VStack mt={2}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="sm" color="gray.500">
              {truncate(device.name, 10)}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <AntDesign
                name="star"
                size={15}
                color="grey"
                style={{ marginTop: 3 }}
              />
              <Text fontSize="sm">{averageRating.toFixed(1)}</Text>
            </View>
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  )
}

export default DeviceItem
