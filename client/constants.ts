import { IWeekDay } from './types'

export const PHONE = '8 (905) 840-44-04'
export const EMAIL = 'ooomk_nv@mail.ru'

export const days: IWeekDay[] = [
  { name: 'monday', label: 'Понедельник' },
  { name: 'tuesday', label: 'Вторник' },
  { name: 'wednesday', label: 'Среда' },
  { name: 'thursday', label: 'Четверг' },
  { name: 'friday', label: 'Пятница' },
  { name: 'saturday', label: 'Суббота' },
  { name: 'sunday', label: 'Воскресенье' }
]

export const daysNames = days.map(day => day.name)