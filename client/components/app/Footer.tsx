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
  blank?: boolean
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
      href: '/privacy',
      text: 'Положение об обработке персональных данных'
    },
    {
      href: 'https://minzdrav.gov.ru/documents/9070-prikaz-ministerstva-zdravoohraneniya-rossiyskoy-federatsii-ot-30-dekabrya-2014-g-956n-ob-informatsii-neobhodimoy-dlya-provedeniya-nezavisimoy-otsenki-kachestva-okazaniya-uslug-meditsinskimi-organizatsiyami-i-trebovaniyah-k-soderzhaniyu-i-forme-predostavleniya-informatsii-o-deyatelnosti-meditsinskih-organizatsiy-razmeschaemoy-na-ofitsialnyh-saytah-ministerstva-zdravoohraneniya-rossiyskoy-federatsii-organov-gosudarstvennoy-vlasti-sub-ektov-rossiyskoy-federatsii-organov-mestnogo-samoupravleniya-i-meditsinskih-organizatsiy-v-informatsionno-telekommunikatsionnoy-seti-internet',
      text: 'Информация по приказу 956н',
      blank: true
    }
  ]

  const contacts: IContact[] = [
    {
      text: 'г. Оренбург, ул. Шевченко 20в, Оф. 404',
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
                <a
                  target={link.blank ? '_blank' : undefined}
                  rel={link.blank ? 'noreferrer' : undefined}
                >
                  {link.text}
                </a>
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
