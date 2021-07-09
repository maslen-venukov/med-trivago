import React from 'react'

import Modal, { ModalProps } from 'antd/lib/modal'
import Tooltip from 'antd/lib/tooltip'
import Tag from 'antd/lib/tag'
import Popconfirm from 'antd/lib/popconfirm'

import { Colors, IAppointmentHour } from '../../types'

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
  const TimeTag: React.FC<ITimeTagProps> = ({ hour }) => hour.appointed ? (
    <Tooltip title="Данное время занято" placement="right">
      <Tag color={Colors.Red} style={{ cursor: 'default' }} className="service__appointment-hour">
        {hour.label}
      </Tag>
    </Tooltip>
  ) : (
    popconfirm ? (
      <Popconfirm
        title={`Вы действительно хотите выбрать ${serviceName} на ${hour.label}, ${date}`}
        onConfirm={() => onSelectTime(hour.label)}
        okText="Да"
        cancelText="Нет"
      >
        <Tag color={Colors.Accent} className="service__appointment-hour">
          {hour.label}
        </Tag>
      </Popconfirm>
    ) : (
      <Tag color={Colors.Accent} className="service__appointment-hour" onClick={() => onSelectTime(hour.label)}>
        {hour.label}
      </Tag>
    )
  )

  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
      width={525}
      onCancel={onCancel}
    >
      {appointmentHours.map(hour => <TimeTag key={hour.label} hour={hour} />)}
    </Modal>
  )
}

export default TimeModal