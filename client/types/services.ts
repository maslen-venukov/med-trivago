import { ISchedule, IWeekSchedule } from './'

export interface IService {
  _id: string
  name: string
  price: number
  category: string
  schedule?: IWeekSchedule
  deleted?: boolean
  hospital: {
    name: string
    address: string
    phone: string
    schedule?: ISchedule
  }
}

export interface IShortService {
  _id?: string
  name: string
  price: number
  category: string
}

export interface IServicesState {
  services: IService[]
  loading: boolean
}

export enum ServicesActionTypes {
  SET_SERVICES = 'SET_SERVICES',
  SET_SERVICES_LOADING = 'SET_SERVICES_LOADING',
  ADD_SERVICE = 'ADD_SERVICE',
  REMOVE_SERVICE = 'REMOVE_SERVICE'
}

interface ISetIServices {
  type: ServicesActionTypes.SET_SERVICES,
  payload: IService[]
}

interface ISetIServicesLoading {
  type: ServicesActionTypes.SET_SERVICES_LOADING,
  payload: boolean
}

interface IAddService {
  type: ServicesActionTypes.ADD_SERVICE,
  payload: IService
}

interface IRemoveService {
  type: ServicesActionTypes.REMOVE_SERVICE,
  payload: string
}

export type ServicesAction = ISetIServices | ISetIServicesLoading | IAddService | IRemoveService