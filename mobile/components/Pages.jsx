import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../Context'
import { HStack, Button } from 'native-base'

const Pages = observer(() => {
  const { device } = useContext(Context)
  const pageCount = Math.ceil(device.totalCount / device.limit)
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <HStack space={2} mt={4} justifyContent="center">
      {pages.map((page) => (
        <Button
          key={page}
          variant={device.page === page ? 'solid' : 'outline'}
          onPress={() => device.setPage(page)}
        >
          {page}
        </Button>
      ))}
    </HStack>
  )
})

export default Pages
