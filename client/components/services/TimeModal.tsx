import React from 'react'

import Modal, { ModalProps } from 'antd/lib/modal'
import Tooltip from 'antd/lib/tooltip'
import Tag from 'antd/lib/tag'
import Popconfirm from 'antd/lib/popconfirm'

import { IAppointmentHour } from '../../types'

interface ITimeModalProps extends ModalProps {
  appointmentHours: IAppointmentHour[]
  popconfirm?: boolean
  serviceName?: string
  date?: string
  onSelectTime: (time: string) => void
}

interface ITimeTagProps {
  hour: IAppointmentHour
}

const TimeModal: React.FC<ITimeModalProps> = ({ title, visible, onCancel, appointmentHours, popconfirm, serviceName, date, onSelectTime }) => {
  const FreeTimeTag: React.FC<ITimeTagProps> = ({ hour }) => popconfirm ? (
    <Popconfirm
      title={`Вы действительно хотите выбрать ${serviceName} на ${hour.label}, ${date}`}
      onConfirm={() => onSelectTime(hour.label)}
      okText="Да"
      cancelText="Нет"
    >
      <Tag className="service__appointment-hour">
        {hour.label}
      </Tag>
    </Popconfirm>
  ) : (
    <Tag className="service__appointment-hour" onClick={() => onSelectTime(hour.label)}>
      {hour.label}
    </Tag>
  )

  const BusyTimeTag: React.FC<ITimeTagProps> = ({ hour }) => (
    <Tooltip title="Данное время занято" placement="right">
      <Tag className="service__appointment-hour service__appointment-hour--busy">
        {hour.label}
      </Tag>
    </Tooltip>
  )

  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
      width={525}
      onCancel={onCancel}
    >
      {appointmentHours.map(hour => hour.appointed
        ? <BusyTimeTag key={hour.label} hour={hour} />
        : <FreeTimeTag key={hour.label} hour={hour} />)}
    </Modal>
  )
}

export default TimeModal