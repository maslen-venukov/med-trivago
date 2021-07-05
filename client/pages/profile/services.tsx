import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import Popconfirm from 'antd/lib/popconfirm'
import Typography from 'antd/lib/typography'
import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Space from 'antd/lib/space'
import Divider from 'antd/lib/divider'

import ProfileLayout from '../../layouts/ProfileLayout'

import ServicesDrawer from '../../components/services/ServicesDrawer'

import { fetchCreateService, fetchHospitalServices, fetchRemoveService, fetchUpdateService } from '../../api/services'
import { fetchCategories } from '../../api/categories'

import { setServices } from '../../store/actions/services'
import { setCategories } from '../../store/actions/categories'

import useSearch from '../../hooks/useSearch'
import useDrawers from '../../hooks/useDrawers'

import renderDate from '../../utils/renderDate'

import { RootState } from '../../store/reducers'
import { IService, IShortService } from '../../types/services'

const Services: React.FC = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { services, loading } = useSelector((state: RootState) => state.services)
  const { categories } = useSelector((state: RootState) => state.categories)
  const { currentHospital } = useSelector((state: RootState) => state.hospitals)

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

  const getServiceData = (data: IService | IShortService) => {
    const { name, price, category } = data
    return { name, price, category }
  }

  const onCreate = (values: IShortService) => {
    dispatch(fetchCreateService(values))
    onCloseCreateDrawer()
    form.resetFields()
  }

  const onUpdate = (values: IShortService) => {
    id && dispatch(fetchUpdateService(id, getServiceData(values)))
    onCloseUpdateDrawer()
  }

  const onRemove = (id: string) => dispatch(fetchRemoveService(id))

  useEffect(() => {
    dispatch(fetchHospitalServices())
    dispatch(fetchCategories())
    return () => {
      dispatch(setServices([]))
      dispatch(setCategories([]))
    }
  }, [dispatch])

  return (
    <ProfileLayout title="Услуги">
      <Table
        dataSource={services}
        loading={loading && !!currentHospital}
        size="middle"
        rowKey={record => record._id}
        title={() => <Button onClick={onOpenCreateDrawer} type="primary">Добавить услугу</Button>}
      >
        <Column title="Название" dataIndex="name" key="name" {...getColumnSearchProps('name')} />
        <Column
          title="Стоимость"
          dataIndex="price"
          key="price"
          render={(value: string) => `${value} ₽`}
          sorter={(a: IService, b: IService) => a.price - b.price}
        />
        <Column
          title="Категория"
          dataIndex="category"
          key="category"
          filters={currentHospital?.serviceList.map(list => {
            const category = categories.find(category => list.category === category._id)
            return {
              text: category?.name || '',
              value: category?._id || ''
            }
          })}
          onFilter={(value, record: IService) => {
            const category = categories.find(category => category._id === value)
            return category?.name === record.category
          }}
        />
        <Column title="Дата добавления" dataIndex="createdAt" key="createdAt" render={renderDate} />
        <Column
          title="Действия"
          key="action"
          render={(_, record: IService) => (
            <Space split={<Divider type="vertical" />}>
            <Typography.Link onClick={() => onOpenUpdateDrawer(record._id, getServiceData(record))}>
              Изменить
            </Typography.Link>

            <Popconfirm
              title="Вы действительно хотите удалить услугу?"
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

      <ServicesDrawer
        title="Добавление услуги"
        initialValues={{ category: '' }}
        visible={createDrawerVisible}
        submitText="Добавить"
        form={form}
        onFinish={onCreate}
        onClose={onCloseCreateDrawer}
      />

      <ServicesDrawer
        title="Изменение услуги"
        visible={updateDrawerVisible}
        submitText="Сохранить"
        form={form}
        onFinish={onUpdate}
        onClose={onCloseUpdateDrawer}
      />
    </ProfileLayout>
  )
}

export default Services