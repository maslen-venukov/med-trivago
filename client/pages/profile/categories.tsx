import React, { useEffect } from 'react'
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

interface ICategoriesFormValues {
  name: string
}

const Categories: React.FC = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { categories, loading } = useSelector((state: RootState) => state.categories)

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

  const onCreate = (values: ICategoriesFormValues) => {
    dispatch(fetchCreateCategory(values.name))
    onCloseCreateDrawer()
  }

  const onUpdate = (values: ICategoriesFormValues) => {
    id && dispatch(fetchUpdateCategory(id, values.name))
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
              <Typography.Link onClick={() => onOpenUpdateDrawer(record._id, { name: record.name })}>
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
        onFinish={onUpdate}
        onClose={onCloseUpdateDrawer}
      />
    </ProfileLayout>
  )
}

export default Categories
