import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../Context'
import { VStack, HStack, Box } from 'native-base'
import DeviceItem from './DeviceItem'

const DeviceList = observer(() => {
  const { device } = useContext(Context)

  const rows = []
  for (let i = 0; i < device.devices.length; i += 2) {
    rows.push(device.devices.slice(i, i + 2))
  }

  // return (
  //   <ScrollView>
  //     <VStack space={4}>
  //       {device.devices.map((device) => (
  //         <DeviceItem key={device.id} device={device} />
  //       ))}
  //     </VStack>
  //   </ScrollView>
  // )
  return (
    <VStack space={4}>
      {rows.map((row, rowIndex) => (
        <HStack key={rowIndex} space={4} justifyContent="space-between">
          {row.map((device) => (
            <Box key={device.id} flex={1}>
              <DeviceItem device={device} />
            </Box>
          ))}
        </HStack>
      ))}
    </VStack>
  )
})

export default DeviceList
