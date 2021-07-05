import { IService } from './services'

export interface IAppointment {
  _id: string
  name: string
  date: Date
  phone: string
  service: IService
  deleted: boolean
}

export interface IShortAppointment {
  name: string
  date: Date
  phone: string
  service: string
}

export interface IAppointmentsState {
  appointments: IAppointment[]
  appointedDates: Date[]
  loading: boolean
}

export enum AppointmentsActionTypes {
  SET_APPOINTMENTS = 'SET_APPOINTMENTS',
  SET_APPOINTMENTS_LOADING = 'SET_APPOINTMENTS_LOADING',
  ADD_APPOINTMENT = 'ADD_APPOINTMENT',
  REMOVE_APPOINTMENT = 'REMOVE_APPOINTMENT',
  UPDATE_APPOINTMENT = 'UPDATE_APPOINTMENT',
  SET_APPOINTED_DATES = 'SET_APPOINTED_DATES',
  ADD_APPOINTED_DATE = 'ADD_APPOINTED_DATE'
}

interface ISetAppointments {
  type: AppointmentsActionTypes.SET_APPOINTMENTS,
  payload: IAppointment[]
}

interface ISetAppointmentsLoading {
  type: AppointmentsActionTypes.SET_APPOINTMENTS_LOADING,
  payload: boolean
}

interface IAddAppointment {
  type: AppointmentsActionTypes.ADD_APPOINTMENT,
  payload: IAppointment
}

interface IRemoveAppointment {
  type: AppointmentsActionTypes.REMOVE_APPOINTMENT,
  payload: string
}

interface IUpdateAppointment {
  type: AppointmentsActionTypes.UPDATE_APPOINTMENT,
  payload: IAppointment
}

interface ISetAppointedDates {
  type: AppointmentsActionTypes.SET_APPOINTED_DATES,
  payload: Date[]
}

interface IAddAppointedDate {
  type: AppointmentsActionTypes.ADD_APPOINTED_DATE,
  payload: Date
}

export type AppointmentsAction =
  ISetAppointments
  | ISetAppointmentsLoading
  | IAddAppointment
  | IRemoveAppointment
  | IUpdateAppointment
  | ISetAppointedDates
  | IAddAppointedDate