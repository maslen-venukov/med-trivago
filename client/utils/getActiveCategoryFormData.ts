import moment, { Moment } from 'moment'

import { ISchedule, IWeekSchedule } from '../types'

import { daysNames } from '../constants'

export const parseTime = (date: string) => moment(new Date(`${date} 2021`))

const getActiveCategoryFormData = (schedule?: IWeekSchedule) => {
  const parseWeekDay = (day?: ISchedule): [Moment, Moment] => {
    if(!day) {
      return [moment(), moment()]
    }
    return [parseTime(day.start), parseTime(day.end)]
  }

  const data = schedule ? Object.entries(schedule).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [`${key}Weekend`]: false,
      [key]: parseWeekDay(value)
    }
  }, {}) : {}

  const weekends = daysNames.reduce((acc, day) => ({
    ...acc,
    [`${day}Weekend`]: true
  }), {})

  return {
    ...weekends,
    ...data
  }
}

export default getActiveCategoryFormData