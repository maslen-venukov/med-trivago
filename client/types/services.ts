import { ISchedule } from './'

export interface IService {
  _id?: string
  name: string
  price: number
  category: string
  schedule?: {
    weekdays: ISchedule
    saturday?: ISchedule
    sunday?: ISchedule
  }
  hospital: {
    name: string
    address: string
    phone: string
    schedule?: ISchedule
  }
}