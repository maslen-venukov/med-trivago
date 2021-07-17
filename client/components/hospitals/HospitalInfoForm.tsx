import React from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import TimePicker from 'antd/lib/time-picker'
import MedicineBoxOutlined from '@ant-design/icons/MedicineBoxOutlined'
import HomeOutlined from '@ant-design/icons/HomeOutlined'
import PhoneOutlined from '@ant-design/icons/PhoneOutlined'
import GlobalOutlined from '@ant-design/icons/GlobalOutlined'

import cities from '../../data/cities.json'

const HospitalInfoForm: React.FC = () => {
  return (
    <>
      <Form.Item
        name="name"
        label="Наименование"
        rules={[{ required: true, message: 'Пожалуйста введите наименование!' }]}
      >
        <Input
          prefix={<MedicineBoxOutlined className="form__icon" />}
          placeholder="Наименование"
        />
      </Form.Item>

      <Form.Item
        name="city"
        label="Город"
        rules={[{ required: true, message: 'Пожалуйста выберите город!' }]}
      >
        <Select
          showSearch
          allowClear
          placeholder="Выберите город"
          optionFilterProp="children"
          filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {cities.sort().map(city => (
            <Select.Option key={city} value={city}>{city}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="address"
        label="Адрес"
        rules={[{ required: true, message: 'Пожалуйста введите адрес!' }]}
      >
        <Input
          prefix={<HomeOutlined className="form__icon" />}
          placeholder="Адрес"
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Телефон"
        rules={[{ required: true, message: 'Пожалуйста введите номер телефона!' }]}
      >
        <Input
          prefix={<PhoneOutlined className="form__icon" />}
          placeholder="Телефон"
        />
      </Form.Item>

      <Form.Item
        name="website"
        label="Веб-сайт"
      >
        <Input
          prefix={<GlobalOutlined className="form__icon" />}
          placeholder="Веб-сайт"
        />
      </Form.Item>

      <Form.Item
        name="schedule"
        label="График работы"
        rules={[{ required: true, message: 'Пожалуйста введите рабочее время!' }]}
      >
        <TimePicker.RangePicker inputReadOnly format="HH:mm" minuteStep={30} className="form__timepicker" />
      </Form.Item>
    </>
  )
}

export default HospitalInfoForm
