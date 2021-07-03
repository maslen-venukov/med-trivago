import { useState } from 'react'

import { FormInstance } from 'antd/lib/form'

const useDrawers = (form: FormInstance) => {
  const [createDrawerVisible, setCreateDrawerVisible] = useState<boolean>(false)
  const [updateDrawerVisible, setUpdateDrawerVisible] = useState<boolean>(false)
  const [id, setId] = useState<string | null>(null)

  const onOpenCreateDrawer = () => setCreateDrawerVisible(true)

  const onCloseCreateDrawer = () => {
    setCreateDrawerVisible(false)
    form.resetFields()
  }

  const onChangeUpdateDrawer = (id: string | null, visible: boolean) => {
    setId(id)
    setUpdateDrawerVisible(visible)
  }

  const onOpenUpdateDrawer = (id: string, data: object) => {
    onChangeUpdateDrawer(id, true)
    form.setFieldsValue(data)
  }

  const onCloseUpdateDrawer = () => {
    onChangeUpdateDrawer(null, false)
    form.resetFields()
  }

  return {
    createDrawerVisible,
    updateDrawerVisible,
    id,
    onOpenCreateDrawer,
    onCloseCreateDrawer,
    onOpenUpdateDrawer,
    onCloseUpdateDrawer
  }
}

export default useDrawers