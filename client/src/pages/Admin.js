import React, { useState, useContext, useEffect } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Context } from '../index'
import { fetchBrands, fetchTypes } from '../http/deviceAPI'
import CreateBrand from '../components/modals/CreateBrand'
import CreateDevice from '../components/modals/CreateDevice'
import CreateType from '../components/modals/CreateType'
import EditBrand from '../components/modals/EditBrand'
import EditType from '../components/modals/EditType'
import EditDevice from '../components/modals/EditDevice'
import DeleteBrand from '../components/modals/DeleteBrand'
import DeleteType from '../components/modals/DeleteType'
import DeleteDevice from '../components/modals/DeleteDevice'

const Admin = () => {
  const { device } = useContext(Context)
  const [brandVisible, setBrandVisible] = useState(false)
  const [typeVisible, setTypeVisible] = useState(false)
  const [deviceVisible, setDeviceVisible] = useState(false)
  const [editBrandVisible, setEditBrandVisible] = useState(false)
  const [editTypeVisible, setEditTypeVisible] = useState(false)
  const [editDeviceVisible, setEditDeviceVisible] = useState(false)
  const [deleteBrandVisible, setDeleteBrandVisible] = useState(false)
  const [deleteTypeVisible, setDeleteTypeVisible] = useState(false)
  const [deleteDeviceVisible, setDeleteDeviceVisible] = useState(false)

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data))
    fetchBrands().then((data) => device.setBrands(data))
  }, [device])

  return (
    <Container className="d-flex flex-column">
      <Button
        variant="outline-dark"
        className="mt-4 p-2"
        onClick={() => setTypeVisible(true)}
      >
        Добавить тип
      </Button>
      <Button
        variant="outline-dark"
        className="mt-4 p-2"
        onClick={() => setBrandVisible(true)}
      >
        Добавить бренд
      </Button>
      <Button
        variant="outline-dark"
        className="mt-4 p-2"
        onClick={() => setDeviceVisible(true)}
      >
        Добавить устройство
      </Button>
      <Button
        variant="outline-dark"
        className="mt-4 p-2"
        onClick={() => setEditTypeVisible(true)}
      >
        Редактировать тип
      </Button>
      <Button
        variant="outline-dark"
        className="mt-4 p-2"
        onClick={() => setEditBrandVisible(true)}
      >
        Редактировать бренд
      </Button>
      <Button
        variant="outline-dark"
        className="mt-4 p-2"
        onClick={() => setEditDeviceVisible(true)}
      >
        Редактировать устройство
      </Button>
      <Button
        variant="outline-dark"
        className="mt-4 p-2"
        onClick={() => setDeleteTypeVisible(true)}
      >
        Удалить тип
      </Button>
      <Button
        variant="outline-dark"
        className="mt-4 p-2"
        onClick={() => setDeleteBrandVisible(true)}
      >
        Удалить бренд
      </Button>
      <Button
        variant="outline-dark"
        className="mt-4 p-2"
        onClick={() => setDeleteDeviceVisible(true)}
      >
        Удалить устройство
      </Button>

      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <CreateDevice
        show={deviceVisible}
        onHide={() => setDeviceVisible(false)}
      />
      <EditBrand
        show={editBrandVisible}
        onHide={() => setEditBrandVisible(false)}
      />
      <EditType
        show={editTypeVisible}
        onHide={() => setEditTypeVisible(false)}
      />
      <EditDevice
        show={editDeviceVisible}
        onHide={() => setEditDeviceVisible(false)}
      />
      <DeleteBrand
        show={deleteBrandVisible}
        onHide={() => setDeleteBrandVisible(false)}
      />
      <DeleteType
        show={deleteTypeVisible}
        onHide={() => setDeleteTypeVisible(false)}
      />
      <DeleteDevice
        show={deleteDeviceVisible}
        onHide={() => setDeleteDeviceVisible(false)}
      />
    </Container>
  )
}

export default Admin
