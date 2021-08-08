import React from 'react'

import Modal, { ModalProps } from 'antd/lib/modal'

import TimeTag from './TimeTag'

import { IAppointmentHour } from '../../types'

interface ITimeModalProps extends ModalProps {
  appointmentHours: IAppointmentHour[]
  popconfirm?: boolean
  serviceName?: string
  date?: string
  onSelectTime: (time: string) => void
}

const TimeModal: React.FC<ITimeModalProps> = ({
  title,
  visible,
  className,
  onCancel,
  appointmentHours,
  popconfirm,
  serviceName,
  date,
  onSelectTime
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
      width={530}
      onCancel={onCancel}
      className={className}
    >
      {appointmentHours.length ? appointmentHours.map(hour => (
        <TimeTag
          key={hour.label}
          hour={hour}
          popconfirm={popconfirm}
          serviceName={serviceName}
          date={date}
          onSelect={onSelectTime}
        />
      )) : 'Нет доступного времени для записи'}
    </Modal>
  )
}

export default TimeModal