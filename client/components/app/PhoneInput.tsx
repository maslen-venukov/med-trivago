import React from 'react'
import NumberFormat from 'react-number-format'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import validatePhone from '../../utils/validatePhone'

const PhoneInput: React.FC = () => {
  return (
    <Form.Item
      label="Номер телефона"
      name="phone"
      rules={[{ required: true }, validatePhone]}
    >
      <NumberFormat
        customInput={Input}
        format="+7 (###) ###-##-##"
        allowEmptyFormatting
        mask="_"
      />
    </Form.Item>
  )
}

export default PhoneInput
