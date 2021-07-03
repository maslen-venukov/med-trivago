import React from 'react'
import { useSelector } from 'react-redux'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Select from 'antd/lib/select'

import { RootState } from '../../store/reducers'
import CustomDrawer from '../app/CustomDrawer'
import { ICustomDrawerProps } from '../../types'

const ServicesDrawer: React.FC<ICustomDrawerProps> = ({ title, visible, submitText, form, onFinish, onClose }) => {
  const { currentHospital } = useSelector((state: RootState) => state.hospitals)
  const { categories } = useSelector((state: RootState) => state.categories)

  return (
    <CustomDrawer
      title={title}
      visible={visible}
      form={form}
      submitText={submitText}
      initialValues={{ category: '' }}
      onFinish={onFinish}
      onClose={onClose}
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
        rules={[{ required: true, message: 'Пожалуйста выберите категорию!' }]}
      >
        <Select>
          <Select.Option value="" disabled>
            <span className="placeholder">Категория</span>
          </Select.Option>
          {currentHospital?.serviceList.map(list => {
            const category = categories.find(category => category._id === list.category)
            return category && (
              <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
            )
          })}
        </Select>
      </Form.Item>
    </CustomDrawer>
  )
}

export default ServicesDrawer