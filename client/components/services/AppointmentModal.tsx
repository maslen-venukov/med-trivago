import React from 'react'
import NumberFormat from 'react-number-format'

import Modal, { ModalProps } from 'antd/lib/modal'
import Form, { FormProps, RuleObject } from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Agreement from '../app/Agreement'

import { StoreValue } from 'antd/lib/form/interface'

export interface IAppointmentFormValues {
  name: string
  phone: string
}

interface IAppointmentModalProps extends ModalProps, FormProps<IAppointmentFormValues> {
  title: string
}

const AppointmentModal: React.FC<IAppointmentModalProps> = ({ title, visible, form, onCancel, onFinish }) => {
  const validatePhone = () => ({
    validator(_: RuleObject, value: StoreValue) {
      if(!value || value === '+7 (___) ___-__-__') {
        return Promise.reject(new Error('Пожалуйста введите ваш номер телефона!'))
      }
      if(value.includes('_')) {
        return Promise.reject(new Error('Некорректный формат номера телефона!'))
      }
      return Promise.resolve()
    }
  })

  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
      width={530}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Ваше имя"
          name="name"
          rules={[{ required: true, message: 'Пожалуйста введите ваше имя!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Номер телефона"
          name="phone"
          rules={[validatePhone]}
        >
          <NumberFormat
            customInput={Input}
            format="+7 (###) ###-##-##"
            allowEmptyFormatting
            mask="_"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Записаться
          </Button>
        </Form.Item>

        <Agreement />
      </Form>
    </Modal>
  )
}

export default AppointmentModal