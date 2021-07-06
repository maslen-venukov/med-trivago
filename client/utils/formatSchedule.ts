import { Moment } from 'moment'

const formatSchedule = (schedule: [Moment, Moment]) => {
  const format = 'HH:mm'
  return {
    start: schedule[0].format(format),
    end: schedule[1].format(format)
  }
}

export default formatSchedule