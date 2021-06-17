import React, { useState } from 'react'
import { useRouter } from 'next/router'
import moment, { Moment } from 'moment'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import DatePicker from 'antd/lib/date-picker'
import TimePicker from 'antd/lib/time-picker'
import Button from 'antd/lib/button'

import getDisabledHours from '../utils/getDisabledHours'

import { ISchedule } from '../types'

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
  const router = useRouter()

  const [weekday, setWeekday] = useState<number | null>(null)

  const onFormFinish = (values: AppointmentFormValues) => {
    const service = router.query.id
    console.log({ ...values, service })
  }

  const onDateChange = (date: Moment | null) => {
    const dateWeekday = date?.weekday()
    const value = dateWeekday !== undefined ? dateWeekday : null
    setWeekday(value)
  }

  const getDisabledDate = (date: Moment) => {
    const isWeekend = weekend.includes(date.weekday())
    const isBefore = date.isBefore(moment(new Date()).add(-1, 'days'))
    return isWeekend || isBefore
  }

  return (
    <Form layout="vertical" onFinish={onFormFinish}>
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
          disabledDate={getDisabledDate}
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
