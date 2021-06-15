import { ISchedule } from '../types/services'

const getPeriod = (schedule?: ISchedule) => {
  if(schedule) {
    return `${schedule.start} — ${schedule.end}`
  }
  return 'выходной'
}

export default getPeriod