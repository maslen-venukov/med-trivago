import { IActiveCategoryFormValues, IWeekendState } from '../pages/profile/active-categories'
import { IWeekSchedule } from '../types'

const getActiveCategoryData = (formValues: IActiveCategoryFormValues, weekend: IWeekendState) => {
  const format = 'HH:mm'

  const data: IWeekSchedule = {
    weekdays: {
      start: formValues.weekdays[0].format(format),
      end: formValues.weekdays[1].format(format)
    }
  }

  if(!weekend.saturday && formValues.saturday) {
    data.saturday = {
      start: formValues.saturday[0].format(format),
      end: formValues.saturday[1].format(format)
    }
  }

  if(!weekend.sunday && formValues.sunday) {
    data.sunday = {
      start: formValues.sunday[0].format(format),
      end: formValues.sunday[1].format(format)
    }
  }

  return data
}

export default getActiveCategoryData