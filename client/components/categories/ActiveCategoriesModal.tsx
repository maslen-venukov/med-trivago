import React, { useState, useEffect } from 'react'

import Modal from 'antd/lib/modal'
import Form, { FormProps } from 'antd/lib/form'
import TimePicker from 'antd/lib/time-picker'
import Button from 'antd/lib/button'

import WeekendDaySchedule from './WeekendDaySchedule'

import { IWeekendState } from '../../pages/profile/active-categories'
import { ModalProps } from 'antd'

interface IActiveCategoriesModalProps extends ModalProps, FormProps {
  title?: string
  categoryName: string
  weekend: IWeekendState
  setWeekend: (weekend: IWeekendState) => void
}

const ActiveCategoriesModal: React.FC<IActiveCategoriesModalProps> = ({ categoryName, visible, form, weekend, onCancel, onFinish, setWeekend }) => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    visible
      ? setMounted(true)
      : setTimeout(() => setMounted(false), 300)
  }, [visible])

  return mounted ? (
    <Modal
      title={`Расписание ${categoryName}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Будние"
          name="weekdays"
          rules={[{ required: true, message: 'Пожалуйста введите расписание в будние дни!' }]}
        >
          <TimePicker.RangePicker format="HH:mm" minuteStep={30} />
        </Form.Item>

        <WeekendDaySchedule
          name="saturday"
          label="Суббота"
          message="Пожалуйста введите расписание в субботу!"
          state={weekend}
          setState={setWeekend}
        />

        <WeekendDaySchedule
          label="Воскресенье"
          name="sunday"
          message="Пожалуйста введите расписание в воскресенье!"
          state={weekend}
          setState={setWeekend}
        />

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  ) : null
}

export default ActiveCategoriesModal