import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'

import ConfigProvider from 'antd/lib/config-provider'
import locale from 'antd/lib/locale/ru_RU'
import notification from 'antd/lib/notification'

import 'moment/locale/ru'
moment.locale('ru')

import { API_URL } from '../constants'

import { wrapper } from '../store'

import { fetchCurrentHospital } from '../store/actions/hospitals'
import { decrementNotifications, incrementNotifications, setSocket } from '../store/actions/socket'
import { auth } from '../store/actions/user'

import connectSocket from '../utils/connectSocket'
import renderDate from '../utils/renderDate'

import { RootState } from '../store/reducers'
import { Roles, SocketActions } from '../types'

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
    currentHospital && socket?.emit(SocketActions.JOIN, currentHospital._id)
  }, [socket, currentHospital])

  useEffect(() => {
    socket?.on(SocketActions.WATCH, data => {
      notification.open({
        key: data._id,
        message: 'Новая запись на прием',
        description: `${data.service.name} — ${renderDate(data.date)}`,
        className: 'cursor-pointer',
        duration: 0,
        onClick: () => {
          router.push('/profile/appointment')
          notification.close(data._id)
          dispatch(decrementNotifications())
        }
      })
      dispatch(incrementNotifications())
    })
  }, [socket])

  return (
    <ConfigProvider locale={locale}>
      <Component {...pageProps} />
    </ConfigProvider>
  )
}

export default wrapper.withRedux(WrappedApp)