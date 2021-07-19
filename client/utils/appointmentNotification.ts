import { Dispatch } from 'redux'
import { NextRouter } from 'next/router'
import notification from 'antd/lib/notification'

import { setAppointmentsSeen } from '../api/appointments'

import { decrementNotifications } from '../store/actions/socket'

import renderDate from './renderDate'

import { IAppointment } from '../types/appointments'
import { SocketAction } from '../types/socket'

const appointmentNotification = (data: IAppointment, router: NextRouter) => (dispatch: Dispatch<SocketAction>) => {
  const id = data._id
  const service = typeof data.service !== 'string' && data.service.name
  const date = renderDate(data.date.toString())

  const onClose = (id: string) => {
    setAppointmentsSeen(id)
    dispatch(decrementNotifications())
  }

  notification.open({
    key: id,
    message: 'Новая запись на прием',
    description: `${service} — ${date}`,
    className: 'cursor-pointer',
    duration: 0,
    onClick: () => {
      router.push('/profile/appointment')
      notification.close(id)
      onClose(id)
    },
    onClose: () => onClose(id)
  })
}

export default appointmentNotification