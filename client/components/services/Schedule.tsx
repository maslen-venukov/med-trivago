import React from 'react'

import Popover from 'antd/lib/popover'
import Typography from 'antd/lib/typography'

import getPeriod from '../../utils/getPeriod'

import { IWeekSchedule } from '../../types'

import { days } from '../../constants'

interface IScheduleProps {
  schedule?: IWeekSchedule
}

const Schedule: React.FC<IScheduleProps> = ({ children, schedule }) => {
  const data = Object.entries(schedule!).map(([key, value]) => ({
    ...days.find(day => day.name === key),
    schedule: value
  }))

  const content = (
    <div className="service__schedule">
      {data.map(item => (
        <Typography.Paragraph key={item.name}>{item.label}: {getPeriod(item.schedule)}</Typography.Paragraph>
      ))}
    </div>
  )

  return (
    <Popover content={content} title="График работы" placement="right">
      {children}
    </Popover>
  )
}

export default Schedule