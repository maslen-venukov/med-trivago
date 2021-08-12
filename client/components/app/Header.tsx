import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'

import Connections, { IConnection } from './Connections'

import PhoneFilled from '@ant-design/icons/PhoneFilled'
import MailFilled from '@ant-design/icons/MailFilled'

import getPhoneHref from '../../utils/getPhoneHref'

import { RootState } from '../../store/reducers'

import { EMAIL, PHONE } from '../../constants'

interface INavItem {
  href: string
  text: string
}

const Header: React.FC = () => {
  const { user, ready } = useSelector((state: RootState) => state.user)

  const nav: INavItem[] = [
    {
      href: '/',
      text: 'Главная'
    },
    {
      href: '/about',
      text: 'О нас'
    },
    {
      href: '/search',
      text: 'Услуги'
    },
    {
      href: '/cooperation',
      text: 'Сотрудничество'
    },
    {
      href: '/contacts',
      text: 'Контакты'
    }
  ]

  const connections: IConnection[] = [
    {
      text: PHONE,
      icon: <PhoneFilled className="mirrored" />,
      href: getPhoneHref(PHONE)
    },
    {
      text: EMAIL,
      icon: <MailFilled />,
      href: `mailto:${EMAIL}`
    }
  ]

  return (
    <header className="header">
      <div className="header__upper">
        <Link href="/">
          <a className="header__logo">
            <Image
              src="/logo.svg"
              alt="MeDi — Медицинская диагностика"
              width={192}
              height={64}
              loading="eager"
            />
          </a>
        </Link>

        <div className="header__info">
          <p>Медицинская диагностика</p>
          <p>все виды исследований</p>
          <p>единая онлайн запись 24 часа</p>
        </div>

        <Connections connections={connections} className="header__connections" />
      </div>

      <div className="header__lower">
        <nav className="header__nav nav">
          <ul className="nav__list list-reset">
            {nav.map(item => (
              <li key={item.href} className="nav__item">
                <Link href={item.href}>
                  <a className="nav__link">{item.text}</a>
                </Link>
              </li>
            ))}
            {ready && user && (
              <li className="nav__item">
                <Link href="/profile">
                  <a className="nav__link">Личный кабинет</a>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header