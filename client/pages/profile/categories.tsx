import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import Popconfirm from 'antd/lib/popconfirm'
import Space from 'antd/lib/space'
import Typography from 'antd/lib/typography'
import Divider from 'antd/lib/divider'
import Button from 'antd/lib/button'
import Form from 'antd/lib/form'

import ProfileLayout from '../../layouts/ProfileLayout'

import CategoriesDrawer from '../../components/categories/CategoriesDrawer'

import { fetchCategories, fetchCreateCategory, fetchRemoveCategory, fetchUpdateCategory } from '../../api/categories'

import { setCategories } from '../../store/actions/categories'

import useSearch from '../../hooks/useSearch'
import useDrawers from '../../hooks/useDrawers'

import renderDate from '../../utils/renderDate'

import { RootState } from '../../store/reducers'
import { ICategory } from '../../types/categories'
import { UploadFile } from 'antd/lib/upload/interface'

interface ICategoriesFormValues {
  name: string
  description: string
  image: { file: UploadFile, fileList: UploadFile[] }
}

const Categories: React.FC = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { categories, loading } = useSelector((state: RootState) => state.categories)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const getColumnSearchProps = useSearch()
  const {
    createDrawerVisible,
    updateDrawerVisible,
    id,
    onOpenCreateDrawer,
    onCloseCreateDrawer,
    onOpenUpdateDrawer,
    onCloseUpdateDrawer
  } = useDrawers(form)

  const getFormData = (values: ICategoriesFormValues) => {
    const { name, description, image } = values
    const fileObj = typeof image !== 'string' && image.file.originFileObj
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    if(fileObj) {
      formData.append('file', fileObj)
    }
    return formData
  }

  const setupUpdateDrawer = (record: ICategory) => {
    setFileList([{
      uid: '1',
      name: record.name,
      url: `${process.env.NEXT_PUBLIC_ENV_API_URL}/uploads/${record.image}`,
    }])
    onOpenUpdateDrawer(record._id, record)
  }

  const onCreate = (values: ICategoriesFormValues) => {
    const formData = getFormData(values)
    dispatch(fetchCreateCategory(formData))
    onCloseCreateDrawer()
  }

  const onUpdate = (values: ICategoriesFormValues) => {
    const formData = getFormData(values)
    id && dispatch(fetchUpdateCategory(id, formData))
    onCloseUpdateDrawer()
  }

  const onRemove = (id: string) => dispatch(fetchRemoveCategory(id))

  useEffect(() => {
    dispatch(fetchCategories())
    return () => {
      dispatch(setCategories([]))
    }
  }, [dispatch])

  return (
    <ProfileLayout title="Категории">
      <Table
        dataSource={categories}
        loading={loading}
        size="middle"
        rowKey={record => record._id}
        title={() => <Button onClick={onOpenCreateDrawer} type="primary">Добавить категорию</Button>}
      >
        <Column title="Имя" dataIndex="name" key="name" {...getColumnSearchProps('name')} />
        <Column title="Дата добавления" dataIndex="createdAt" key="createdAt" render={renderDate} />
        <Column
          title="Действия"
          key="action"
          render={(_, record: ICategory) => (
            <Space split={<Divider type="vertical" />}>
              <Typography.Link onClick={() => setupUpdateDrawer(record)}>
                Изменить
              </Typography.Link>

              <Popconfirm
                title="Вы действительно хотите удалить категорию?"
                onConfirm={() => onRemove(record._id)}
                okText="Да"
                cancelText="Нет"
              >
                <Typography.Text type="danger" className="cursor-pointer">
                  Удалить
                </Typography.Text>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      <CategoriesDrawer
        title="Добавление категории"
        visible={createDrawerVisible}
        form={form}
        submitText="Добавить"
        onFinish={onCreate}
        onClose={onCloseCreateDrawer}
      />

      <CategoriesDrawer
        title="Изменение категории"
        visible={updateDrawerVisible}
        form={form}
        submitText="Сохранить"
        fileList={fileList}
        setFileList={setFileList}
        onFinish={onUpdate}
        onClose={onCloseUpdateDrawer}
      />
    </ProfileLayout>
  )
}

export default Categories
