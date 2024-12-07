import React, { useContext, useEffect, useCallback } from 'react'
import { Box, ScrollView, VStack } from 'native-base'
import { useFocusEffect } from '@react-navigation/native'
import TypeBar from '../../components/TypeBar'
import BrandBar from '../../components/BrandBar'
import DeviceList from '../../components/DeviceList'
import Pages from '../../components/Pages'
import { observer } from 'mobx-react-lite'
import { Context } from '../../Context'
import { fetchBrands, fetchDevices, fetchTypes } from '../../http/deviceAPI'

const Shop = observer(() => {
  const { device } = useContext(Context)

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data))
    fetchBrands().then((data) => device.setBrands(data))
    fetchDevices(null, null, 1, 8).then((data) => {
      device.setDevices(data.rows)
      device.setTotalCount(data.count)
    })
  }, [device])

  useEffect(() => {
    fetchDevices(
      device.selectedType.id,
      device.selectedBrand.id,
      device.page,
      8
    ).then((data) => {
      device.setDevices(data.rows)
      device.setTotalCount(data.count)
    })
  }, [device.page, device.selectedType, device.selectedBrand, device])

  useFocusEffect(
    useCallback(() => {
      fetchTypes().then((data) => device.setTypes(data))
      fetchBrands().then((data) => device.setBrands(data))
      fetchDevices(
        device.selectedType.id,
        device.selectedBrand.id,
        device.page,
        8
      ).then((data) => {
        device.setDevices(data.rows)
        device.setTotalCount(data.count)
      })
    }, [device.page, device.selectedType, device.selectedBrand, device])
  )

  return (
    <ScrollView>
      <Box p={4}>
        <VStack space={4}>
          <TypeBar />
          <BrandBar />
          <DeviceList />
          <Pages />
        </VStack>
      </Box>
    </ScrollView>
  )
})

export default Shop
