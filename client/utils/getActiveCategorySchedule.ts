import { IActiveCategoryFormValues, IWeekendState } from '../pages/profile/active-categories'
import { Weekday } from '../types'
import formatSchedule from './formatSchedule'

const getActiveCategoryData = (formValues: IActiveCategoryFormValues, weekend: IWeekendState) => (
  Object.keys(weekend).reduce((acc, key) => (
    !weekend[key as Weekday] && formValues[key as Weekday]
      ? {
        ...acc,
        [key]: formatSchedule(formValues[key as Weekday]!)
      }
      : acc
  ), {})
)

export default getActiveCategoryData