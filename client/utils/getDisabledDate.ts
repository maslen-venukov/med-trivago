import moment, { Moment } from 'moment'

import { IWeekSchedule, Weekday } from '../types'

import { daysNames } from '../constants'

const getWeekend = (schedule: IWeekSchedule) => (
  daysNames.reduce((acc: number[], day, index) => (
    !schedule[day as Weekday]
      ? [...acc, index]
      : acc
  ), [])
)

const getDisabledDate = (date: Moment, schedule: IWeekSchedule) => {
  const isWeekend = getWeekend(schedule).includes(date.weekday())
  const isBefore = date.isBefore(moment(new Date()).add(-1, 'days'))
  return isWeekend || isBefore
}

export default getDisabledDate