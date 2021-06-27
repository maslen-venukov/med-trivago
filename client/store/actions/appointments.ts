import { Dispatch } from 'react'
import { Socket } from 'socket.io-client'
import axios from 'axios'
import message from 'antd/lib/message'

import catchError from '../../utils/catchError'

import { AppointmentsAction, AppointmentsActionTypes, IAppointment } from '../../types/appointments'
import { SocketActions } from '../../types'

const setAppointments = (payload: IAppointment[]): AppointmentsAction => ({
  type: AppointmentsActionTypes.SET_APPOINTMENTS,
  payload
})

const setAppointmentsLoading = (payload: boolean): AppointmentsAction => ({
  type: AppointmentsActionTypes.SET_APPOINTMENTS_LOADING,
  payload
})

export const addAppointment = (payload: IAppointment): AppointmentsAction => ({
  type: AppointmentsActionTypes.ADD_APPOINTMENT,
  payload
})

const setAppointmentDates = (payload: Date[]): AppointmentsAction => ({
  type: AppointmentsActionTypes.SET_APPOINTED_DATES,
  payload
})

const addAppointedDate = (payload: Date): AppointmentsAction => ({
  type: AppointmentsActionTypes.ADD_APPOINTED_DATE,
  payload
})

export const fetchAppointments = () => (dispatch: Dispatch<AppointmentsAction>) => {
  dispatch(setAppointmentsLoading(true))
  axios.get('/api/appointments')
    .then(({ data }) => dispatch(setAppointments(data.appointments)))
    .catch(catchError)
    .finally(() => dispatch(setAppointmentsLoading(false)))
}

export const fetchAppointedDates = (serviceId: string) => (dispatch: Dispatch<AppointmentsAction>) => {
  axios.get(`api/appointments/appointed-dates/${serviceId}`)
    .then(({ data }) => dispatch(setAppointmentDates(data.appointedDates)))
    .catch(catchError)
}

export const fetchCreateAppointment = (data: IAppointment, hospitalId: string, socket: Socket) => (dispatch: Dispatch<AppointmentsAction>) => {
  axios.post('/api/appointments', data)
    .then(({ data }) => {
      message.success(data.message)
      dispatch(addAppointedDate(data.appointment.date))
      socket.emit(SocketActions.APPOINT, { hospitalId, data: data.appointment })
    })
    .catch(catchError)
}