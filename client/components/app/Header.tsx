import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Search from '../search/Search'

interface INavItem {
  href: string
  text: string
}

const Header: React.FC = () => {
  const nav: INavItem[] = [
    {
      href: '/search',
      text: 'Услуги'
    },
    {
      href: '/about',
      text: 'О нас'
    }
  ]

  return (
    <header className="header">
      <div className="header__container container">
        <Link href="/">
          <a className="header__logo">
            <Image
              src="/logo.svg"
              alt="МеДи — Медицинская диагностика"
              width={111}
              height={32}
            />
          </a>
        </Link>

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

        <Search className="header__search" />
      </div>
    </header>
  )
}

export default Header