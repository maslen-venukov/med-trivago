import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Table from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import Popconfirm from 'antd/lib/popconfirm'
import Typography from 'antd/lib/typography'
import Button from 'antd/lib/button'
import Drawer from 'antd/lib/drawer'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Select from 'antd/lib/select'

import ProfileLayout from '../../layouts/ProfileLayout'

import { fetchAddService, fetchHospitalServices, fetchRemoveService } from '../../api/services'
import { fetchCategories } from '../../api/categories'

import renderDate from '../../utils/renderDate'

import { RootState } from '../../store/reducers'
import { IService, IShortService } from '../../types/services'

const Services: React.FC = () => {
  const dispatch = useDispatch()

  const { services, loading } = useSelector((state: RootState) => state.services)
  const { currentHospital } = useSelector((state: RootState) => state.hospitals)
  const { categories } = useSelector((state: RootState) => state.categories)

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)

  const [form] = Form.useForm()

  const onOpenDrawer = () => setDrawerVisible(true)
  const onCloseDrawer = () => setDrawerVisible(false)

  const onAddService = (values: IShortService) => {
    dispatch(fetchAddService(values))
    onCloseDrawer()
    form.resetFields()
  }

  const onRemove = (id: string) => dispatch(fetchRemoveService(id))

  useEffect(() => {
    dispatch(fetchHospitalServices())
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <ProfileLayout title="Услуги">
      <Table
        dataSource={services}
        loading={loading && !!currentHospital}
        size="middle"
        rowKey={record => record._id}
        title={() => <Button onClick={onOpenDrawer} type="primary">Добавить услугу</Button>}
      >
        <Column title="Название" dataIndex="name" key="name" />
        <Column title="Стоимость" dataIndex="price" key="price" render={(value: string) => `${value} ₽`} />
        <Column title="Категория" dataIndex="category" key="category" />
        <Column title="Дата добавления" dataIndex="createdAt" key="createdAt" render={renderDate} />
        <Column
          title="Действия"
          key="action"
          render={(_, record: IService) => (
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
          )}
        />
      </Table>

      <Drawer
        title="Добавление услуги"
        onClose={onCloseDrawer}
        visible={drawerVisible}
        width={400}
      >
        <Form
          onFinish={onAddService}
          initialValues={{ category: '' }}
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Пожалуйста введите название!' }]}
          >
            <Input placeholder="Название" />
          </Form.Item>

          <Form.Item
            label="Стоимость"
            name="price"
            rules={[{ required: true, message: 'Пожалуйста введите стоимость!' }]}
          >
            <InputNumber placeholder="Стоимость" />
          </Form.Item>

          <Form.Item
            label="Категория"
            name="category"
            rules={[{ required: true, message: 'Пожалуйста введите стоимость!' }]}
          >
            <Select onChange={() => {}}>
              <Select.Option value="" disabled>
                <span style={{ color: '#bfbfbf' }}>Категория</span>
              </Select.Option>
              {currentHospital?.serviceList.map(list => {
                const category = categories.find(category => category._id === list.category)
                return category && (
                  <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Добавить
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </ProfileLayout>
  )
}

export default Services
