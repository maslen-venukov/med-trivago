import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'

import ConfigProvider from 'antd/lib/config-provider'
import locale from 'antd/lib/locale/ru_RU'
import message from 'antd/lib/message'

import 'moment/locale/ru'
moment.locale('ru')

import { API_URL } from '../constants'

import { wrapper } from '../store'

import { fetchCurrentHospital } from '../api/hospitals'
import { incrementNotifications, setSocket } from '../store/actions/socket'
import { addAppointment } from '../store/actions/appointments'
import { auth } from '../api/user'

import connectSocket from '../utils/connectSocket'
import appointmentNotification from '../utils/appointmentNotification'
import cookiesNotification from '../utils/cookiesNotification'

import { RootState } from '../store/reducers'
import { Roles, SocketActions } from '../types'

import '../styles/index.sass'
import { IAppointment } from '../types/appointments'

import cities from '../data/cities.json'

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
    currentHospital && socket?.emit(SocketActions.Join, currentHospital._id)
  }, [socket, currentHospital])

  useEffect(() => {
    socket?.on(SocketActions.Watch, (data: IAppointment) => {
      dispatch(appointmentNotification(data, router))
      dispatch(incrementNotifications())
      dispatch(addAppointment(data))
      const audio = new window.Audio('/notification/sound.mp3')
      audio.play()
    })
  }, [socket])

  useEffect(() => {
    cookiesNotification(router)
    axios.get('http://api.sypexgeo.net/')
      .then(({ data }) => {
        const ip = data.ip
        const city = data.city.name_ru
        console.log(ip, city)
        if(cities.includes(city)) {
          message.success(`Ваш город ${city}`)
        }
      })
  }, [])

  return (
    <ConfigProvider locale={locale}>
      <Component {...pageProps} />
    </ConfigProvider>
  )
}

export default wrapper.withRedux(WrappedApp)