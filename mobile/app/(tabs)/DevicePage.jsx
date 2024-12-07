import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Text,
  VStack,
  ScrollView,
} from 'native-base'
import { useRoute } from '@react-navigation/native'
import { fetchOneDevice } from '../../http/deviceAPI'
import { Context } from '../../Context'
import {
  rateDevice,
  fetchDeviceRating,
  fetchAverageRating,
} from '../../http/ratingAPI'
// import { fetchExchangeRate } from '../../http/currencyAPI'
import { truncate } from '../../utils/truncate'
import { MaterialIcons } from '@expo/vector-icons'
import { REACT_APP_API_URL } from '@env'

const DevicePage = () => {
  const { params } = useRoute()
  const { id } = params
  const [device, setDevice] = useState({ info: [] })
  // const [usdRate, setUsdRate] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [rating, setRating] = useState(0)
  const { basket, user } = useContext(Context)

  useEffect(() => {
    setRating(0)

    fetchOneDevice(id).then((data) => setDevice(data))

    fetchAverageRating(id).then((rating) => setAverageRating(rating))

    if (user.isAuth) {
      fetchDeviceRating(id, user.user.id).then((data) => {
        if (data) {
          setRating(data.rate)
        } else {
          setRating(0)
        }
      })
    }
  }, [id, user.isAuth, user.user.id])

  // useEffect(() => {
  //   fetchExchangeRate().then((rate) => setUsdRate(rate))
  // }, [id])

  const handleAddToBasket = async () => {
    basket.addDevice(device.id)
  }

  const handleRate = async (rate) => {
    if (!user.isAuth) {
      alert('Вы должны войти в систему, чтобы оставить оценку.')
      return
    }

    try {
      await rateDevice(id, user.user.id, rate)
      setRating(rate)
      fetchAverageRating(id).then((rating) => setAverageRating(rating))
    } catch (error) {
      console.error('Ошибка при отправке рейтинга:', error)
    }
  }

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Box flex={1} p={4} bg="white">
        <HStack space={4} justifyContent="center" alignItems="center">
          <Box
            flex={1}
            bg="gray.100"
            borderRadius="md"
            p={3}
            justifyContent="center"
            alignItems="center"
          >
            {device.img ? (
              <Image
                source={{ uri: `${REACT_APP_API_URL}/${device.img}` }}
                alt={device.name || 'Изображение устройства'}
                size="2xl"
                resizeMode="contain"
              />
            ) : (
              <Text fontSize="md" color="gray.500">
                Загрузка изображения...
              </Text>
            )}
          </Box>
          <VStack flex={2} space={4}>
            <Text fontSize="2xl" fontWeight="bold">
              {truncate(device.name, 30)}
            </Text>
            <Text fontSize="lg" color="gray.500">
              Цена: {device.price} руб.
              {/* ({usdRate ? (device.price * usdRate).toFixed(2) : '...'}$) */}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Средняя оценка:
            </Text>
            <HStack space={1} alignItems="center">
              {[1, 2, 3, 4, 5].map((star) => (
                <MaterialIcons
                  key={star}
                  name="star"
                  size={28}
                  color={star <= averageRating ? 'gold' : 'gray'}
                />
              ))}
              <Text fontSize="lg" ml={2}>
                ({averageRating.toFixed(2)})
              </Text>
            </HStack>
          </VStack>
        </HStack>

        {user.isAuth && (
          <VStack mt={6} space={4}>
            <Text fontSize="lg" fontWeight="bold">
              Оцените устройство:
            </Text>
            <HStack justifyContent="center" space={2}>
              {[1, 2, 3, 4, 5].map((star) => (
                <MaterialIcons
                  key={star}
                  name="star"
                  size={40}
                  color={star <= rating ? 'gold' : 'gray'}
                  onPress={() => handleRate(star)}
                />
              ))}
            </HStack>
            <Button
              onPress={handleAddToBasket}
              colorScheme="blue"
              width="100%"
              mt={4}
            >
              Добавить в корзину
            </Button>
          </VStack>
        )}

        <VStack mt={8} space={4}>
          <Text fontSize="lg" fontWeight="bold">
            Характеристики
          </Text>
          {device.info.length > 0 ? (
            device.info.map((item, index) => (
              <Box
                key={item.id}
                bg={index % 2 === 0 ? 'gray.100' : 'white'}
                p={4}
                borderRadius="md"
                mb={2}
                shadow={1}
              >
                <Text>
                  <Text fontWeight="bold">{item.title}:</Text>{' '}
                  {item.description}
                </Text>
              </Box>
            ))
          ) : (
            <Center>
              <Text fontSize="md" color="gray.500" fontStyle="italic">
                Характеристики пока не добавлены.
              </Text>
            </Center>
          )}
        </VStack>
      </Box>
    </ScrollView>
  )
}

export default DevicePage
