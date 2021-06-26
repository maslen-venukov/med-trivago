import { Socket } from 'socket.io-client'
import axios from 'axios'
import message from 'antd/lib/message'

import catchError from '../../utils/catchError'

import { IAppointment } from '../../types/appointments'
import { SocketActions } from '../../types'

export const fetchCreateAppointment = (data: IAppointment, hospitalId: string, socket: Socket) => {
  axios.post('/api/appointments', data)
    .then(({ data }) => {
      message.success(data.message)
      socket.emit(SocketActions.APPOINT, { hospitalId, data: data.appointment })
    })
    .catch(catchError)
}