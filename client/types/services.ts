import { ISchedule } from './'

export interface IService {
  _id: string
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

export interface IServicesState {
  services: IService[]
  loading: boolean
}

export enum ServicesActionTypes {
  SET_SERVICES = 'SET_SERVICES',
  SET_SERVICES_LOADING = 'SET_SERVICES_LOADING'
}

interface ISetIServices {
  type: ServicesActionTypes.SET_SERVICES,
  payload: IService[]
}

interface ISetIServicesLoading {
  type: ServicesActionTypes.SET_SERVICES_LOADING,
  payload: boolean
}

export type ServicesAction = ISetIServices | ISetIServicesLoading