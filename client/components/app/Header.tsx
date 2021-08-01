import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Contacts, { IContact } from './Contacts'

import PhoneFilled from '@ant-design/icons/PhoneFilled'
import MailFilled from '@ant-design/icons/MailFilled'

import getPhoneHref from '../../utils/getPhoneHref'

import { EMAIL, PHONE } from '../../constants'

interface INavItem {
  href: string
  text: string
}

const Header: React.FC = () => {
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

  const contacts: IContact[] = [
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
              alt="МеДи — Медицинская диагностика"
              width={192}
              height={64}
            />
          </a>
        </Link>

        <div className="header__info">
          <p>Медицинская диагностика</p>
          <p>все виды исследований</p>
          <p>единая онлайн запись 24 часа</p>
        </div>

        <Contacts contacts={contacts} className="header__contacts" />
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
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header