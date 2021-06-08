import type { AppProps } from 'next/app'

import ConfigProvider from 'antd/lib/config-provider'
import locale from 'antd/lib/locale/ru_RU'

import '../styles/index.sass'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={locale}>
      <Component {...pageProps} />
    </ConfigProvider>
  )
}

export default MyApp