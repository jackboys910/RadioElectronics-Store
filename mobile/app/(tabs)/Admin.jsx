import React, { useState, useContext, useEffect } from 'react'
import { Button, VStack, ScrollView } from 'native-base'
import { Context } from '../../Context'
import { fetchBrands, fetchTypes } from '../../http/deviceAPI'
import CreateBrand from '../../components/modals/CreateBrand'
import CreateDevice from '../../components/modals/CreateDevice'
import CreateType from '../../components/modals/CreateType'
import EditBrand from '../../components/modals/EditBrand'
import EditType from '../../components/modals/EditType'
import EditDevice from '../../components/modals/EditDevice'
import DeleteBrand from '../../components/modals/DeleteBrand'
import DeleteType from '../../components/modals/DeleteType'
import DeleteDevice from '../../components/modals/DeleteDevice'

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
    <ScrollView>
      <VStack space={4} mt={4} px={4}>
        <Button onPress={() => setTypeVisible(true)}>Добавить тип</Button>
        <Button onPress={() => setBrandVisible(true)}>Добавить бренд</Button>
        <Button onPress={() => setDeviceVisible(true)}>
          Добавить устройство
        </Button>
        <Button onPress={() => setEditTypeVisible(true)}>
          Редактировать тип
        </Button>
        <Button onPress={() => setEditBrandVisible(true)}>
          Редактировать бренд
        </Button>
        <Button onPress={() => setEditDeviceVisible(true)}>
          Редактировать устройство
        </Button>
        <Button onPress={() => setDeleteTypeVisible(true)}>Удалить тип</Button>
        <Button onPress={() => setDeleteBrandVisible(true)}>
          Удалить бренд
        </Button>
        <Button onPress={() => setDeleteDeviceVisible(true)}>
          Удалить устройство
        </Button>
      </VStack>

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
    </ScrollView>
  )
}

export default Admin
