import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../index'
import ListGroup from 'react-bootstrap/ListGroup'
import { truncate } from '../utils/truncate'

const TypeBar = observer(() => {
  const { device } = useContext(Context)

  return (
    <ListGroup>
      {device.types.map((type) => (
        <ListGroup.Item
          style={{ cursor: 'pointer' }}
          active={type.id === device.selectedType.id}
          onClick={() => device.setSelectedType(type)}
          key={type.id}
          title={type.name}
        >
          {truncate(type.name, 12)}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
})

export default TypeBar
