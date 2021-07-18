import { ISchedule, IWeekSchedule } from './'

export interface IService {
  _id: string
  name: string
  price: number
  category: string
  schedule?: IWeekSchedule
  appointedDates: Date[]
  deleted: boolean
  hospital: {
    name: string
    city: string
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
  CREATE_SERVICE = 'CREATE_SERVICE',
  UPDATE_SERVICE = 'UPDATE_SERVICE',
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

interface ICreateService {
  type: ServicesActionTypes.CREATE_SERVICE,
  payload: IService
}

interface IUpdateService {
  type: ServicesActionTypes.UPDATE_SERVICE,
  payload: IService
}

interface IRemoveService {
  type: ServicesActionTypes.REMOVE_SERVICE,
  payload: string
}

export type ServicesAction = ISetIServices | ISetIServicesLoading | ICreateService | IUpdateService | IRemoveService