import { ISchedule } from './'

interface IShortService {
  _id: string
  name: string
  price: string
}

export interface IServiceList {
  category: string
  schedule: {
    weekdays: ISchedule
    saturday: ISchedule
    sunday: ISchedule
  }
  services: IShortService[]
}

export interface IHospital {
  _id: string
  name: string
  address: string
  phone: string
  schedule: ISchedule
  serviceList: IServiceList[]
}

export interface IHospitalsState {
  hospitals: IHospital[]
  loading: boolean
}

export enum HospitalsActionTypes {
  SET_HOSPITALS = 'SET_HOSPITALS',
  SET_HOSPITALS_LOADING = 'SET_HOSPITALS_LOADING'
}

interface ISetHospitals {
  type: HospitalsActionTypes.SET_HOSPITALS,
  payload: IHospital[]
}

interface ISetHospitalsLoading {
  type: HospitalsActionTypes.SET_HOSPITALS_LOADING,
  payload: boolean
}

export type HospitalsAction = ISetHospitals | ISetHospitalsLoading