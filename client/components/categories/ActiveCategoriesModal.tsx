import React, { useState, useEffect } from 'react'

import Modal, { ModalProps } from 'antd/lib/modal'
import Form, { FormProps } from 'antd/lib/form'
import Button from 'antd/lib/button'

import WeekendDaySchedule from './WeekendDaySchedule'

import { IWeekendState } from '../../pages/profile/active-categories'

import { days } from '../../constants'

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
      className="active-categories__modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {days.map(day => (
          <WeekendDaySchedule
            key={day.name}
            name={day.name}
            label={day.label}
            message={`Пожалуйста введите расписание в ${day.label.toLowerCase()}`}
            state={weekend}
            setState={setWeekend}
          />
        ))}

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