import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { HStack, IconButton, Text, Button, Badge, Box } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  AUTH_ROUTE,
  SHOP_ROUTE,
  PROFILE_ROUTE,
} from '../utils/consts'

const NavBar = observer(() => {
  const { user, basket } = useContext(Context)
  const navigation = useNavigation()

  const logOut = async () => {
    user.setUser({})
    user.setIsAuth(false)
    basket.setBasketDevices([])
    await AsyncStorage.removeItem('token')
  }

  return (
    <HStack
      bg="dark.400"
      px={4}
      py={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <HStack alignItems="center" space={2}>
        <IconButton
          icon={<FontAwesome6 name="microchip" color="cyan" size={24} />}
          onPress={() => navigation.navigate(SHOP_ROUTE)}
        />
        <Text
          color="white"
          fontSize="lg"
          fontWeight="bold"
          style={{ marginLeft: -10 }}
        >
          РК
        </Text>
      </HStack>
      {user.isAuth ? (
        <HStack space={4} alignItems="center">
          <Box position="relative">
            <IconButton
              style={{ marginRight: -20 }}
              icon={
                <FontAwesome6 name="basket-shopping" color="white" size={24} />
              }
              onPress={() => navigation.navigate(BASKET_ROUTE)}
            />
            {basket.basketDevices.length > 0 && (
              <Badge
                bg={'purple.400'}
                rounded="full"
                position="absolute"
                top={-2}
                right={-23}
                height={7}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 13,
                    minWidth: 16,
                    textAlign: 'center',
                  }}
                >
                  {basket.basketDevices.length}
                </Text>
              </Badge>
            )}
          </Box>
          <IconButton
            style={{ marginRight: -10 }}
            icon={<FontAwesome5 name="user-alt" color="white" size={24} />}
            onPress={() => navigation.navigate(PROFILE_ROUTE)}
          />
          {user.user?.role === 'ADMIN' && (
            <Button onPress={() => navigation.navigate(ADMIN_ROUTE)}>
              Админ
            </Button>
          )}
          <Button onPress={logOut}>Выйти</Button>
        </HStack>
      ) : (
        <Button onPress={() => navigation.navigate(AUTH_ROUTE)}>Войти</Button>
      )}
    </HStack>
  )
})

export default NavBar
