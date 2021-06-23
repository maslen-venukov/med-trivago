import moment, { Moment } from 'moment'

import { IWeekSchedule, IAppointmentHour } from '../types'

const getAppointmentHours = (date: Moment, schedule: IWeekSchedule) => {
  const weekday = date.weekday()

  const getCurrentDaySchedule = (weekday: number, schedule: IWeekSchedule) => {
    const { weekdays, saturday, sunday } = schedule
    switch(weekday) {
      case 5:
        return saturday || weekdays
      case 6:
        return sunday || weekdays
      default:
        return weekdays
    }
  }

  const currentDaySchedule = getCurrentDaySchedule(weekday, schedule)

  return Array(24)
    .fill(0)
    .map((_, index) => index)
    .reduce((acc: IAppointmentHour[], hour) => {
      const create = (hour: number, minutes: number) => ({
        label: moment({ hour, minutes }).format('HH:mm'),
        appointed: false
      })

      const check = (label: string) => {
        const current = Number(`${label.replace(':', '')}`)
        const getValue = (str: 'start' | 'end') => Number(currentDaySchedule[str].replace(':', ''))
        const min = getValue('start')
        const max = getValue('end')
        return current >= min && (current < max || !max)
      }

      const whole = create(hour, 0)
      const half = create(hour, 30)

      const result = []
      check(whole.label) && result.push(whole)
      check(half.label) && result.push(half)

      acc = [...acc, ...result]
      return acc
    }, [])
}

export default getAppointmentHours