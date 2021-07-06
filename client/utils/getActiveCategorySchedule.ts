import { IActiveCategoryFormValues, IWeekendState } from '../pages/profile/active-categories'
import { IWeekSchedule } from '../types'
import formatSchedule from './formatSchedule'

const getActiveCategoryData = (formValues: IActiveCategoryFormValues, weekend: IWeekendState) => {
  const data: IWeekSchedule = {
    weekdays: formatSchedule(formValues.weekdays)
  }

  if(!weekend.saturday && formValues.saturday) {
    data.saturday = formatSchedule(formValues.saturday)
  }

  if(!weekend.sunday && formValues.sunday) {
    data.sunday = formatSchedule(formValues.sunday)
  }

  return data
}

export default getActiveCategoryData