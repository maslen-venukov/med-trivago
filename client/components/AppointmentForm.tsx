import React, { useState } from 'react'
import { Moment } from 'moment'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import DatePicker from 'antd/lib/date-picker'
import TimePicker from 'antd/lib/time-picker'
import Button from 'antd/lib/button'

import getDisabledHours from '../utils/getDisabledHours'

import { ISchedule } from '../types/services'

interface IAppointmentFormProps {
  weekend: number[]
  schedule?: {
    weekdays: ISchedule
    saturday?: ISchedule
    sunday?: ISchedule
  }
}

interface AppointmentFormValues {
  name: string
  phone: string
  date: { _d: Date } & Moment
  time: { _d: Date } & Moment
}

const AppointmentForm: React.FC<IAppointmentFormProps> = ({ weekend, schedule }) => {
  const [weekday, setWeekday] = useState<number | null>(null)

  const onDateChange = (date: Moment | null) => {
    const dateWeekday = date?.weekday()
    const value = dateWeekday !== undefined ? dateWeekday : null
    setWeekday(value)
  }

  return (
    <Form layout="vertical" onFinish={(values: AppointmentFormValues) => console.log(values)}>
      <Form.Item
        label="Ваше имя"
        name="name"
        rules={[{ required: true, message: 'Пожалуйста введите ваше имя!' }]}
      >
        <Input allowClear />
      </Form.Item>

      <Form.Item
        label="Номер телефона"
        name="phone"
        rules={[{ required: true, message: 'Пожалуйста введите ваш номер телефона!' }]}
      >
        <Input allowClear />
      </Form.Item>

      <Form.Item
        label="Дата"
        name="date"
        rules={[{ required: true, message: 'Пожалуйста введите дату!' }]}
      >
        <DatePicker
          format={'DD.MM.YYYY'}
          onChange={onDateChange}
          disabledDate={date => weekend.includes(date.weekday())}
          hideDisabledOptions
          inputReadOnly
        />
      </Form.Item>

      <Form.Item
        label="Время"
        name="time"
        rules={[{ required: true, message: 'Пожалуйста введите время!' }]}
      >
        <TimePicker
          format="HH:mm"
          minuteStep={30}
          disabledHours={() => getDisabledHours(weekday, schedule)}
          hideDisabledOptions
          inputReadOnly
        />
      </Form.Item>

      <Form.Item style={{}}>
        <Button type="primary" htmlType="submit">
          Записаться
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AppointmentForm
