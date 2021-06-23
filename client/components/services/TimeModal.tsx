import React from 'react'

import Modal, { ModalProps } from 'antd/lib/modal'
import Tooltip from 'antd/lib/tooltip'
import Tag from 'antd/lib/tag'

import { IAppointmentHour, Colors } from '../../types'

interface ITimeModalProps extends ModalProps {
  appointmentHours: IAppointmentHour[]
  onOpenAppointmentModal: (time: string) => void
}

interface ITimeTagProps {
  hour: IAppointmentHour
}

const TimeModal: React.FC<ITimeModalProps> = ({ title, visible, width, onCancel, appointmentHours, onOpenAppointmentModal }) => {
  const FreeTimeTag: React.FC<ITimeTagProps> = ({ hour }) => (
    <Tag
      color={Colors.Accent}
      className="service__appointment-hour cursor-pointer"
      onClick={() => onOpenAppointmentModal(hour.label)}
    >
      {hour.label}
    </Tag>
  )

  const BusyTimeTag: React.FC<ITimeTagProps> = ({ hour }) => (
    <Tooltip title="Данное время занято" placement="right">
      <Tag color={Colors.Red} className="service__appointment-hour">
        {hour.label}
      </Tag>
    </Tooltip>
  )

  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
      width={width}
      onCancel={onCancel}
    >
      {appointmentHours.map(hour => hour.appointed
        ? <BusyTimeTag key={hour.label} hour={hour} />
        : <FreeTimeTag key={hour.label} hour={hour} />)}
    </Modal>
  )
}

export default TimeModal