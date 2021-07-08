import moment, { Moment } from 'moment'

import { IWeekSchedule } from '../types'

const getWeekend = (schedule: IWeekSchedule) => {
  const arr = []
  !schedule?.saturday && arr.push(5)
  !schedule?.sunday && arr.push(6)
  return arr
}

const getDisabledDate = (date: Moment, schedule: IWeekSchedule) => {
  const isWeekend = getWeekend(schedule).includes(date.weekday())
  const isBefore = date.isBefore(moment(new Date()).add(-1, 'days'))
  return isWeekend || isBefore
}

export default getDisabledDate