import { NextRouter } from 'next/router'
import cookie from 'cookie'

import notification from 'antd/lib/notification'

import Cookie from '../components/app/Cookie'

const cookiesNotification = (router: NextRouter) => {
  if(cookie.parse(document.cookie).cookie) {
    return
  }
  document.cookie = cookie.serialize('cookie', 'true', { maxAge: 3600 * 24 * 31 })
  notification.open({
    message: 'Мы используем cookie',
    description: 'Продолжая пользоваться сайтом, вы соглашаетесь с использованием файлов cookie.',
    icon: <Cookie />,
    placement: 'bottomLeft',
    duration: 0,
    onClick: () => router.push('/cookie'),
    className: 'cursor-pointer'
  })
}

export default cookiesNotification