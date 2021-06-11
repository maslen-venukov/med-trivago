import React from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import axios from 'axios'

import ConfigProvider from 'antd/lib/config-provider'
import locale from 'antd/lib/locale/ru_RU'

import { API_URL } from '../constants'

import store from '../store'

import '../styles/index.sass'

axios.defaults.baseURL = API_URL

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={locale}>
        <Component {...pageProps} />
      </ConfigProvider>
    </Provider>
  )
}

export default MyApp