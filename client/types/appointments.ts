export interface IAppointment {
  _id?: string
  name: string
  phone: string
  date: Date
  service: string
}

export interface IAppointmentsState {
  appointments: IAppointment[]
  loading: boolean
}

export enum AppointmentsActionTypes {
  SET_APPOINTMENTS = 'SET_APPOINTMENTS'
}

interface ISetAppointments {
  type: AppointmentsActionTypes.SET_APPOINTMENTS,
  payload: IAppointment[]
}

export type AppointmentsAction = ISetAppointments