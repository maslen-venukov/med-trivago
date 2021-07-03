import React from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import { ICustomDrawerProps } from '../../types'
import CustomDrawer from '../app/CustomDrawer'

const CategoriesDrawer: React.FC<ICustomDrawerProps> = ({ title, visible, submitText, form, onFinish, onClose }) => {
  return (
    <CustomDrawer
      title={title}
      visible={visible}
      submitText={submitText}
      form={form}
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
    </CustomDrawer>
  )
}

export default CategoriesDrawer