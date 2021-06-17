import React from 'react'

import Popover from 'antd/lib/popover'
import Typography from 'antd/lib/typography'

import getPeriod from '../utils/getPeriod'

import { ISchedule } from '../types'

interface IScheduleProps {
  schedule?: {
    weekdays: ISchedule
    saturday?: ISchedule
    sunday?: ISchedule
  }
}

const Schedule: React.FC<IScheduleProps> = ({ children, schedule }) => {
  const content = (
    <div className="service__schedule">
      <Typography.Paragraph>Будние: {getPeriod(schedule?.weekdays)}</Typography.Paragraph>
      <Typography.Paragraph>Суббота: {getPeriod(schedule?.saturday)}</Typography.Paragraph>
      <Typography.Paragraph>Воскресенье: {getPeriod(schedule?.sunday)}</Typography.Paragraph>
    </div>
  )

  return (
    <Popover content={content} title="График работы" placement="right">
      {children}
    </Popover>
  )
}

export default Schedule