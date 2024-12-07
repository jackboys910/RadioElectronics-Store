import React, { useContext, useEffect, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Modal,
  Text,
  VStack,
  ScrollView,
} from 'native-base'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Context } from '../../Context'
// import { fetchExchangeRate } from '../../http/currencyAPI'
import { fetchProfile } from '../../http/profileAPI'
import { PROFILE_ROUTE } from '../../utils/consts'
import { truncate } from '../../utils/truncate'
import { REACT_APP_API_URL } from '@env'

const Basket = observer(() => {
  const { basket, profile } = useContext(Context)
  // const [usdRate, setUsdRate] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const navigation = useNavigation()

  useFocusEffect(
    useCallback(() => {
      setPaymentSuccess(false)
    }, [])
  )

  useEffect(() => {
    basket.fetchBasketDevices()
    // fetchExchangeRate().then((rate) => setUsdRate(rate))

    profile.setLoading(true)
    fetchProfile()
      .then((data) => {
        profile.setProfile(data)
        profile.setError(null)
      })
      .catch(() => {
        profile.setError('Ошибка загрузки профиля. Попробуйте позже.')
      })
      .finally(() => {
        profile.setLoading(false)
      })
  }, [basket, profile])

  const checkProfileFields = () => {
    const { firstName, lastName, phone, address } = profile.profile || {}
    return firstName && lastName && phone && address
  }

  const handleOrder = () => {
    if (!checkProfileFields()) {
      setShowProfileModal(true)
    } else {
      setShowModal(true)
    }
  }

  const handleRemove = async (id) => {
    basket.removeDevice(id)
  }

  const handlePayment = () => {
    setIsLoading(true)
    setTimeout(async () => {
      try {
        await basket.handlePayment()
        setIsLoading(false)
        setPaymentSuccess(true)

        setTimeout(() => {
          basket.clearBasket()
          setShowModal(false)
        }, 5000)
      } catch (error) {
        console.error('Ошибка при завершении транзакции:', error)
        setIsLoading(false)
      }
    }, 2000)
  }

  return (
    <ScrollView>
      <Box p={4} safeArea>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Корзина
        </Text>
        {basket.basketDevices.length === 0 ? (
          <Center>
            <Text fontSize="lg">Ваша корзина пуста</Text>
          </Center>
        ) : (
          <>
            <VStack space={4}>
              {basket.basketDevices.map((item) =>
                item.device ? (
                  <HStack
                    key={item.id}
                    alignItems="center"
                    justifyContent="space-between"
                    mb={4}
                    p={3}
                    borderWidth={1}
                    borderColor="coolGray.200"
                    borderRadius="md"
                  >
                    <Image
                      source={{
                        uri: item.device?.img
                          ? `${REACT_APP_API_URL}/` + item.device.img
                          : '',
                      }}
                      alt={item.device.name}
                      size="sm"
                    />
                    <VStack flex={1} mx={3}>
                      <Text fontWeight="bold" isTruncated>
                        {truncate(item.device.name, 26)}
                      </Text>
                      <Text>
                        {item.device.price} руб.
                        {/* ({usdRate
                          ? (item.device.price * usdRate).toFixed(2)
                          : '...'}
                        $) */}
                      </Text>
                    </VStack>
                    <Button
                      colorScheme="danger"
                      onPress={() => handleRemove(item.id)}
                    >
                      Удалить
                    </Button>
                  </HStack>
                ) : null
              )}
            </VStack>

            <HStack justifyContent="space-between" alignItems="center" mt={4}>
              <Text fontSize="lg" fontWeight="bold">
                Итоговая сумма: {basket.totalPrice} руб.
                {/* ({usdRate ? (basket.totalPrice * usdRate).toFixed(2) : '...'}$) */}
              </Text>
            </HStack>

            <VStack space={3} mt={4}>
              <Button colorScheme="danger" onPress={() => basket.clearBasket()}>
                Очистить корзину
              </Button>
              <Button colorScheme="success" onPress={handleOrder}>
                Оформить заказ
              </Button>
            </VStack>
          </>
        )}

        {/* Modal for Payment */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Оплата заказа</Modal.Header>
            <Modal.Body>
              {paymentSuccess ? (
                <Center>
                  <FontAwesome5 name="check" size={50} color="#22c55e" />
                  <Text fontSize="lg" color="green.500" bold>
                    Оплата совершена!
                  </Text>
                  <Text style={{ marginTop: 20 }}>
                    С вами свяжутся по контактному номеру.
                  </Text>
                </Center>
              ) : (
                <>
                  <Box bg="gray.100" p={4} borderRadius="md" mb={4}>
                    <Text>
                      <Text bold>Имя:</Text> {profile.profile?.firstName}
                    </Text>
                    <Text>
                      <Text bold>Фамилия:</Text> {profile.profile?.lastName}
                    </Text>
                    <Text>
                      <Text bold>Адрес:</Text> {profile.profile?.address}
                    </Text>
                    <Text>
                      <Text bold>Телефон:</Text> {profile.profile?.phone}
                    </Text>
                  </Box>
                  <Button
                    colorScheme="primary"
                    isLoading={isLoading}
                    onPress={handlePayment}
                  >
                    Оплатить заказ
                  </Button>
                </>
              )}
            </Modal.Body>
          </Modal.Content>
        </Modal>

        {/* Modal for Profile */}
        <Modal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Заполните профиль</Modal.Header>
            <Modal.Body>
              <Text textAlign="center">
                Чтобы оформить заказ, внесите, пожалуйста, личные данные в
                профиле.
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Button
                colorScheme="primary"
                onPress={() => {
                  setShowProfileModal(false)
                  navigation.navigate(PROFILE_ROUTE)
                }}
              >
                Перейти в личный кабинет
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Box>
    </ScrollView>
  )
})

export default Basket
