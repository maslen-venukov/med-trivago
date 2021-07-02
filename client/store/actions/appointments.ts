import { AppointmentsAction, AppointmentsActionTypes, IAppointment } from '../../types/appointments'

export const setAppointments = (payload: IAppointment[]): AppointmentsAction => ({
  type: AppointmentsActionTypes.SET_APPOINTMENTS,
  payload
})

export const setAppointmentsLoading = (payload: boolean): AppointmentsAction => ({
  type: AppointmentsActionTypes.SET_APPOINTMENTS_LOADING,
  payload
})

export const addAppointment = (payload: IAppointment): AppointmentsAction => ({
  type: AppointmentsActionTypes.ADD_APPOINTMENT,
  payload
})

export const removeAppointment = (payload: string): AppointmentsAction => ({
  type: AppointmentsActionTypes.REMOVE_APPOINTMENT,
  payload
})

export const updateAppointment = (payload: IAppointment): AppointmentsAction => ({
  type: AppointmentsActionTypes.UPDATE_APPOINTMENT,
  payload
})

export const setAppointmentDates = (payload: Date[]): AppointmentsAction => ({
  type: AppointmentsActionTypes.SET_APPOINTED_DATES,
  payload
})

export const addAppointedDate = (payload: Date): AppointmentsAction => ({
  type: AppointmentsActionTypes.ADD_APPOINTED_DATE,
  payload
})