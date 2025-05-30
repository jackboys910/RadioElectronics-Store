import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../index'
import { Card, Row } from 'react-bootstrap'
import { truncate } from '../utils/truncate'

const BrandBar = observer(() => {
  const { device } = useContext(Context)

  return (
    <Row className="d-flex">
      {device.brands.map((brand) => (
        <Card
          style={{ cursor: 'pointer' }}
          key={brand.id}
          className="p-3"
          onClick={() => device.setSelectedBrand(brand)}
          border={brand.id === device.selectedBrand.id ? 'danger' : 'light'}
        >
          {truncate(brand.name, 20)}
        </Card>
      ))}
    </Row>
  )
})

export default BrandBar
