import { Dispatch } from 'redux'
import { Socket } from 'socket.io-client'
import axios from 'axios'
import message from 'antd/lib/message'

import { addAppointedDate, setAppointmentDates, setAppointments, setAppointmentsLoading } from '../store/actions/appointments'

import catchError from '../utils/catchError'

import { AppointmentsAction, IAppointment } from '../types/appointments'
import { SocketActions } from '../types'

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