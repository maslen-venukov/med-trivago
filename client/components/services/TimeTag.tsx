import React from 'react'

import Tooltip from 'antd/lib/tooltip'
import Tag from 'antd/lib/tag'
import Popconfirm from 'antd/lib/popconfirm'

import { Colors, IAppointmentHour } from '../../types'

interface ITimeTagProps {
  hour: IAppointmentHour
  popconfirm?: boolean
  serviceName?: string
  date?: string
  onSelect?: (time: string) => void
}

const TimeTag: React.FC<ITimeTagProps> = ({ hour, popconfirm, serviceName, date, onSelect }) => {
  if(hour.appointed) {
    return (
      <Tooltip title="Данное время занято" placement="right">
        <Tag color={Colors.Red} style={{ cursor: 'default' }} className="service__appointment-hour">
          {hour.label}
        </Tag>
      </Tooltip>
    )
  }

  if(popconfirm) {
    return (
      <Popconfirm
        title={`Вы действительно хотите выбрать ${serviceName} на ${hour.label}, ${date}`}
        onConfirm={() => onSelect && onSelect(hour.label)}
        okText="Да"
        cancelText="Нет"
      >
        <Tag color={Colors.Accent} className="service__appointment-hour">
          {hour.label}
        </Tag>
      </Popconfirm>
    )
  }

  return (
    <Tag
      color={Colors.Accent}
      className="service__appointment-hour"
      style={{ cursor: !onSelect ? 'default' : '' }}
      onClick={() => onSelect && onSelect(hour.label)}
    >
      {hour.label}
    </Tag>
  )
}

export default TimeTag