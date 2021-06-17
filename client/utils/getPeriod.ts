import { ISchedule } from '../types'

const getPeriod = (schedule?: ISchedule) => {
  if(schedule) {
    return `${schedule.start} — ${schedule.end}`
  }
  return 'выходной'
}

export default getPeriod