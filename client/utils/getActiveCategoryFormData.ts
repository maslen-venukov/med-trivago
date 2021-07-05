import moment, { Moment } from 'moment'

import { IActiveCategoryFormValues } from '../pages/profile/active-categories'
import { ISchedule, IWeekSchedule } from '../types'

const getActiveCategoryFormData = (schedule?: IWeekSchedule) => {
  const parseWeekDay = (day?: ISchedule): [Moment, Moment] => {
    if(!day) {
      return [moment(), moment()]
    }
    const parseTime = (date: string) => moment(new Date(`${date} 2021`))
    return [parseTime(day.start), parseTime(day.end)]
  }

  const data: IActiveCategoryFormValues = {
    weekdays: parseWeekDay(schedule?.weekdays),
    saturdayWeekend: false,
    sundayWeekend: false
  }

  if(schedule?.saturday) {
    data.saturday = parseWeekDay(schedule?.saturday)
  } else {
    data.saturdayWeekend = true
  }

  if(schedule?.sunday) {
    data.sunday = parseWeekDay(schedule?.sunday)
  } else {
    data.sundayWeekend = true
  }

  return data
}

export default getActiveCategoryFormData