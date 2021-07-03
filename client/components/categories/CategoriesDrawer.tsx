import React from 'react'

import Button from 'antd/lib/button'
import Drawer, { DrawerProps } from 'antd/lib/drawer'
import Form, { FormProps } from 'antd/lib/form'
import Input from 'antd/lib/input'

interface ICategoriesDrawerProps extends DrawerProps, FormProps {
  title: string
  submitText: string
}

const CategoriesDrawer: React.FC<ICategoriesDrawerProps> = ({ title, visible, form, submitText, onFinish, onClose }) => {
  return (
    <Drawer
      title={title}
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: 'Пожалуйста введите название!' }]}
        >
          <Input placeholder="Название" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default CategoriesDrawer
