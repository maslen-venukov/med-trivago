import React from 'react'

import Drawer from 'antd/lib/drawer'
import Form from 'antd/lib/form'
import Button from 'antd/lib/button'

import { ICustomDrawerProps } from '../../types'

const CustomDrawer: React.FC<ICustomDrawerProps> = ({ children, title, visible, form, initialValues, submitText, onFinish, onClose  }) => {
  return (
    <Drawer
      title={title}
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        {children}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default CustomDrawer