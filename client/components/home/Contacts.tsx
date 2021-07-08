import React from 'react'
import Link from 'next/link'

import Typography from 'antd/lib/typography'

import getPhoneHref from '../../utils/getPhoneHref'

const Contacts = () => {
  const phone = '8 (905) 840-44-04'
  const email = 'ooomk_nv@mail.ru'

  return (
    <div className="contacts">
      <Typography.Title level={5} className="contacts__title">Контакты</Typography.Title>
      <Typography.Paragraph className="contacts__paragraph">Общество с ограниченной ответственностью «МК «НОВЫЕ ТЕХНОЛОГИИ»</Typography.Paragraph>
      <Typography.Paragraph className="contacts__paragraph">Адрес: г.Оренбург, ул.Шевченко 20В. Оф 404</Typography.Paragraph>
      <Typography.Paragraph className="contacts__paragraph">
        Тел: <Link href={getPhoneHref(phone)}><a>{phone}</a></Link>, e-mail: <Link href={`mailto:${email}`}><a>{email}</a></Link>
      </Typography.Paragraph>
    </div>
  )
}

export default Contacts
