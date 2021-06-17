import { ISchedule } from '../types'

const getDisabledHours = (
  weekday: number | null,
  schedule?: {
    weekdays: ISchedule,
    saturday?: ISchedule,
    sunday?: ISchedule
  }
) => {
  if(!schedule) return []

  const getDay = () => {
    switch(weekday) {
      case 0:
        return 'sunday'
      case 6:
        return 'saturday'
      default:
        return 'weekdays'
    }
  }

  const day = schedule[getDay()]
  if(!day) return []

  const start = parseInt(day.start)
  const end = parseInt(day.end)

  const hours = Array(24).fill(0).map((_, index) => index)

  return hours.reduce((acc: number[], hour) => {
    if(hour < start || hour > end && end) {
      return acc = [...acc, hour]
    }
    return acc
  }, [])
}

export default getDisabledHours