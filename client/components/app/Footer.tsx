import React from 'react'
import Link from 'next/link'

import Typography from 'antd/lib/typography'
import HomeFilled from '@ant-design/icons/HomeFilled'
import PhoneFilled from '@ant-design/icons/PhoneFilled'
import MailFilled from '@ant-design/icons/MailFilled'

import getPhoneHref from '../../utils/getPhoneHref'

interface IInfoLink {
  href: string
  text: string
}

interface IContact {
  text: string,
  icon: React.ReactNode,
  href?: string
}

const Footer = () => {
  const phone = '8 (905) 840-44-04'
  const email = 'ooomk_nv@mail.ru'

  const infoLinks: IInfoLink[] = [
    {
      href: '/personal-data',
      text: 'Положение об обработке персональных данных'
    },
    {
      href: '/order-956n',
      text: 'Информация по приказу 956н'
    }
  ]

  const contacts: IContact[] = [
    {
      text: 'г.Оренбург, ул.Шевченко 20в, Оф. 404',
      icon: <HomeFilled />
    },
    {
      text: phone,
      icon: <PhoneFilled className="mirrored" />,
      href: getPhoneHref(phone)
    },
    {
      text: email,
      icon: <MailFilled />,
      href: `mailto:${email}`
    }
  ]

  return (
    <footer className="footer">
      <nav className="footer__info info">
        <ul className="info__list list-reset">
          {infoLinks.map(link => (
            <li key={link.href} className="info__item">
              <Link href={link.href}>
                <a className="info__iink">{link.text}</a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Typography.Paragraph>Общество с ограниченной ответственностью «МК «НОВЫЕ ТЕХНОЛОГИИ»</Typography.Paragraph>

      <div className="contacts">
        <ul className="contacts__list list-reset">
          {contacts.map(contact => (
            <li key={Math.random()} className="contacts__item">
              {contact.href ? (
                <Link href={contact.href}>
                  <a className="contacts__link">{contact.icon} {contact.text}</a>
                </Link>
              ) : (
                <>{contact.icon} {contact.text}</>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

export default Footer
