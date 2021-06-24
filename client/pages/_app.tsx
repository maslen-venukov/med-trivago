import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppProps } from 'next/app'
import axios from 'axios'
import moment from 'moment'

import ConfigProvider from 'antd/lib/config-provider'
import locale from 'antd/lib/locale/ru_RU'

import 'moment/locale/ru'
moment.locale('ru')

import { wrapper } from '../store'

import { auth } from '../store/actions/user'

import { API_URL } from '../constants'

import '../styles/index.sass'

axios.defaults.baseURL = API_URL
axios.defaults.withCredentials = true

const WrappedApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(auth())
  }, [dispatch])

  return (
    <ConfigProvider locale={locale}>
      <Component {...pageProps} />
    </ConfigProvider>
  )
}

export default wrapper.withRedux(WrappedApp)