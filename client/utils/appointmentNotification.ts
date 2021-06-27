import { Dispatch } from 'react'
import { NextRouter } from 'next/router'
import notification from 'antd/lib/notification'

import { decrementNotifications } from '../store/actions/socket'

import renderDate from './renderDate'

import { IAppointment } from '../types/appointments'
import { SocketAction } from '../types/socket'

const appointmentNotification = (data: IAppointment, router: NextRouter) => (dispatch: Dispatch<SocketAction>) => {
  notification.open({
    key: data._id,
    message: 'Новая запись на прием',
    description: `${typeof data.service !== 'string' && data.service.name} — ${renderDate(data.date.toString())}`,
    className: 'cursor-pointer',
    duration: 0,
    onClick: () => {
      router.push('/profile/appointment')
      notification.close(data._id || '')
      dispatch(decrementNotifications())
    }
  })
}

export default appointmentNotification