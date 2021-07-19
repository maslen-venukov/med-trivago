import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'

import ConfigProvider from 'antd/lib/config-provider'
import locale from 'antd/lib/locale/ru_RU'

import 'moment/locale/ru'
moment.locale('ru')

import { API_URL } from '../constants'

import { wrapper } from '../store'

import { auth } from '../api/user'
import { fetchCurrentHospital } from '../api/hospitals'
import { fetchNotSeenAppointments } from '../api/appointments'

import { incrementNotifications, setSocket } from '../store/actions/socket'
import { addAppointment } from '../store/actions/appointments'

import connectSocket from '../utils/connectSocket'
import appointmentNotification from '../utils/appointmentNotification'
import cookiesNotification from '../utils/cookiesNotification'

import { RootState } from '../store/reducers'
import { Roles, SocketActions } from '../types'
import { IAppointment } from '../types/appointments'

import '../styles/index.sass'

axios.defaults.baseURL = API_URL
axios.defaults.withCredentials = true

const WrappedApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { user } = useSelector((state: RootState) => state.user)
  const { currentHospital } = useSelector((state: RootState) => state.hospitals)
  const { socket } = useSelector((state: RootState) => state.socket)

  useEffect(() => {
    dispatch(auth())
  }, [dispatch])

  useEffect(() => {
    if(user?.role === Roles.Hospital) {
      dispatch(setSocket(connectSocket()))
      dispatch(fetchCurrentHospital())
    }
  }, [user])

  useEffect(() => {
    if(currentHospital) {
      socket?.emit(SocketActions.Join, currentHospital._id)
      dispatch(fetchNotSeenAppointments(router))
    }
  }, [socket, currentHospital])

  useEffect(() => {
    socket?.on(SocketActions.Watch, (data: IAppointment) => {
      router.pathname === '/profile/appointment' && dispatch(addAppointment(data))
      dispatch(appointmentNotification(data, router))
      dispatch(incrementNotifications())
      const audio = new window.Audio('/notification/sound.mp3')
      audio.play()
    })
  }, [socket])

  useEffect(() => {
    cookiesNotification(router)
  }, [])

  return (
    <ConfigProvider locale={locale}>
      <Component {...pageProps} />
    </ConfigProvider>
  )
}

export default wrapper.withRedux(WrappedApp)