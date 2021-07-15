import { Moment } from 'moment'

import { ISchedule } from './'
import { IService } from './services'

export interface IRegisterHospitalData {
  email: string
  password: string
  passwordCheck: string
  name: string
  address: string
  phone: string
  schedule: [Moment, Moment] | ISchedule
}

export interface IServiceList {
  category: string
  schedule: {
    weekdays: ISchedule
    saturday: ISchedule
    sunday: ISchedule
  }
  services: IService[]
}

export interface IHospital {
  _id: string
  name: string
  address: string
  phone: string
  website?: string
  schedule: ISchedule
  serviceList: IServiceList[]
}

export interface IHospitalsState {
  hospitals: IHospital[]
  currentHospital: IHospital | null
  loading: boolean
}

export enum HospitalsActionTypes {
  SET_HOSPITALS = 'SET_HOSPITALS',
  SET_CURRENT_HOSPITAL = 'SET_CURRENT_HOSPITAL',
  SET_HOSPITALS_LOADING = 'SET_HOSPITALS_LOADING',
  REMOVE_HOSPITAL = 'REMOVE_HOSPITAL'
}

interface ISetHospitals {
  type: HospitalsActionTypes.SET_HOSPITALS,
  payload: IHospital[]
}

interface ISetHospital {
  type: HospitalsActionTypes.SET_CURRENT_HOSPITAL,
  payload: IHospital
}

interface ISetHospitalsLoading {
  type: HospitalsActionTypes.SET_HOSPITALS_LOADING,
  payload: boolean
}

interface IRemoveHospital {
  type: HospitalsActionTypes.REMOVE_HOSPITAL,
  payload: string
}

export type HospitalsAction = ISetHospitals | ISetHospital | ISetHospitalsLoading | IRemoveHospital