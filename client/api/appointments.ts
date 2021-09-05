import { NextRouter } from 'next/router'
import { Dispatch } from 'redux'
import { Socket } from 'socket.io-client'
import axios from 'axios'
import message from 'antd/lib/message'

import {
  addAppointedDate,
  removeAppointment,
  setAppointedDates,
  setAppointments,
  setAppointmentsLoading,
  updateAppointment
} from '../store/actions/appointments'
import { setCurrentHospital } from '../store/actions/hospitals'
import { setNotifications } from '../store/actions/socket'

import catchError from '../utils/catchError'
import appointmentNotification from '../utils/appointmentNotification'

import { AppointmentsAction, IAppointment, IShortAppointment } from '../types/appointments'
import { HospitalsAction } from '../types/hospitals'
import { SocketAction } from '../types/socket'
import { SocketActions } from '../types'

export const fetchAppointments = () => (dispatch: Dispatch<AppointmentsAction>) => {
  dispatch(setAppointmentsLoading(true))
  axios.get('/api/appointments')
    .then(({ data }) => dispatch(setAppointments(data.appointments)))
    .catch(catchError)
    .finally(() => dispatch(setAppointmentsLoading(false)))
}

export const fetchNotSeenAppointments = (router: NextRouter) => (dispatch: Dispatch<AppointmentsAction | SocketAction> | any) => {
  dispatch(setAppointmentsLoading(true))
  axios.get('/api/appointments/not-seen')
    .then(({ data }) => {
      dispatch(setNotifications(data.appointments.length))
      data.appointments.forEach((appointment: IAppointment) => {
        dispatch(appointmentNotification(appointment, router))
      })
    })
    .catch(catchError)
    .finally(() => dispatch(setAppointmentsLoading(false)))
}

export const setAppointmentsSeen = (id: string) => {
  axios.put(`/api/appointments/set-seen/${id}`)
    .catch(catchError)
}

export const fetchCreateAppointment = (data: IShortAppointment, hospitalId: string, socket: Socket) => (dispatch: Dispatch<AppointmentsAction>) => {
  axios.post('/api/appointments', data)
    .then(({ data }) => {
      message.success(data.message)
      dispatch(addAppointedDate(data.appointment.date))
      socket.emit(SocketActions.Appoint, { hospitalId, data: data.appointment })
    })
    .catch(catchError)
}

export const fetchRemoveAppointment = (id: string) => (dispatch: Dispatch<AppointmentsAction>) => {
  axios.delete(`/api/appointments/${id}`)
    .then(({ data }) => {
      message.success(data.message)
      dispatch(removeAppointment(id))
    })
    .catch(catchError)
}

export const fetchUpdateAppointment = (id: string, data: IShortAppointment) => (dispatch: Dispatch<AppointmentsAction>) => {
  axios.put(`/api/appointments/${id}`, data)
    .then(({ data }) => {
      message.success(data.message)
      dispatch(updateAppointment(data.appointment))
    })
    .catch(catchError)
}

export const fetchAppointedDates = (serviceId: string, cb?: () => void) => (dispatch: Dispatch<AppointmentsAction>) => {
  axios.get(`api/appointed-dates/${serviceId}`)
    .then(({ data }) => {
      dispatch(setAppointedDates(data.appointedDates))
      cb && cb()
    })
    .catch(catchError)
}

export const fetchCreateAppointDate = (serviceId: string, date: Date, cb: () => void) => (dispatch: Dispatch<HospitalsAction>) => {
  axios.post(`/api/appointed-dates/${serviceId}`, { date })
    .then(({ data }) => {
      message.success(data.message)
      dispatch(setCurrentHospital(data.hospital))
      cb()
    })
    .catch(catchError)
}

export const fetchRemoveAppointDate = (serviceId: string, date: Date) => (dispatch: Dispatch<HospitalsAction>) => {
  axios.delete(`/api/appointed-dates/${serviceId}`, { params: date })
    .then(({ data }) => {
      message.success(data.message)
      dispatch(setCurrentHospital(data.hospital))
    })
    .catch(catchError)
}

export const fetchAppointmentByServiceAndDate = async (serviceId: string, date: Date) => {
  try {
    const res = await axios.get('/api/appointments/by-service-and-date', {
      params: {
        serviceId,
        date
      }
    })
    return res.data.appointment
  } catch {
    return null
  }
}